const jwt = require('jsonwebtoken');
const checkUserCredentials = require('./check-user-credentials');

// Mocking jwt.verify to avoid actual token verification during tests
jest.mock('jsonwebtoken');

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockNext = jest.fn();

const userCredentials = {
  id: 'cb5do74e026481fc606fbdi7',
  name: 'User',
  email: 'test@test.com',
  role: 'ADMIN',
};

const validToken = jwt.sign({ type: 'CONSUMER', ...userCredentials }, process.env.JWT_KEY);
const invalidToken = 'invalidToken';

describe('Middleware to check the user credentials', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Valid token type (CONSUMER)', () => {
    const decodedToken = {
      type: 'CONSUMER',
      ...userCredentials,
    };

    jwt.verify.mockReturnValueOnce(decodedToken);

    const request = { headers: { authorization: validToken } };
    const response = mockResponse();

    checkUserCredentials('CONSUMER')(request, response, mockNext);

    expect(jwt.verify).toHaveBeenCalledWith(validToken, process.env.JWT_KEY);

    expect(request.user).toEqual(userCredentials);
    expect(request.token).toEqual({
      value: validToken,
      type: 'CONSUMER',
    });
    expect(mockNext).toBeCalled();
  });

  test('Invalid token type', () => {
    jwt.verify.mockReturnValueOnce({
      type: 'ADMIN',
    });

    const request = { headers: { authorization: invalidToken } };
    const response = mockResponse();

    checkUserCredentials('CONSUMER')(request, response, mockNext);

    expect(jwt.verify).toHaveBeenCalledWith(invalidToken, process.env.JWT_KEY);

    expect(response.status).toHaveBeenCalledWith(401);
    expect(response.json).toHaveBeenCalledWith({
      message: 'Invalid token type',
    });
    expect(mockNext).not.toBeCalled();
  });
});
