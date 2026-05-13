const refreshTokenController = require('./refresh')
const createToken = require('../../utils/create-token')

jest.mock('../../utils/create-token')

describe('Controller to refresh the token', () => {
    let request
    let response

    beforeEach(() => {
        jest.clearAllMocks()
        request = {
            token: { type: 'REFRESH' },
            user: { userId: 'mockUserId' }
        }
        response = {
            json: jest.fn(),
            status: jest.fn(() => response),
            end: jest.fn()
        }
    });

    test('Refresh tokens and return them if the token type is REFRESH', () => {
        createToken.mockReturnValueOnce('mockAccessToken')
        createToken.mockReturnValueOnce('mockRefreshToken')

        refreshTokenController(request, response)

        expect(response.json).toHaveBeenCalledWith({
            token: 'mockAccessToken',
            refreshToken: 'mockRefreshToken'
        })
        expect(createToken).toHaveBeenNthCalledWith(1, request.user, 'CONSUMER', '30m')
        expect(createToken).toHaveBeenNthCalledWith(2, request.user, 'REFRESH', '3d')
    });

    test('Respond with status 401 if the token type is not REFRESH', () => {
        request.token.type = 'OTHER_TYPE'

        refreshTokenController(request, response)

        expect(response.status).toHaveBeenCalledWith(401)
        expect(response.end).toHaveBeenCalledWith()
        expect(createToken).not.toHaveBeenCalled()
    })
})
