const checkUserRole = require('./check-user-role')

mockResponse = () => {
    const response = {}
    response.status = jest.fn().mockReturnValue(response)
    response.json = jest.fn().mockReturnValue(response)

    return response
}

describe('Middleware to check the user role', () => {
    test('The middleware must continue the ejecution if the user role is on the allowed roles list', () => {
        const request = { headers: { 'userrole': 'BASIC' } }
        const response = mockResponse()
        const next = jest.fn()
        checkUserRole(['ADMIN', 'CONS', 'AUTHOR', 'BASIC'])(request, response, next)
        expect(next).toBeCalled()
    })

    test('The middleware must not continue the execution if the user role is not on the allowed roles list (Error 403)', () => {
        const request = { headers: { 'userrole': 'BASIC' } }
        const response = mockResponse()
        const next = jest.fn();

        // Execute the middleware with an unauthorized role
        checkUserRole(['ADMIN'])(request, response, next);

        // Wait for the function to not be invoked
        expect(next).not.toBeCalled();

        // Wait for a 403 status response
        expect(response.status).toHaveBeenCalledWith(403);

        // Wait for the json response as Forbidden
        expect(response.json).toHaveBeenCalledWith({
            message: 'Forbidden access'
        });
    });

    test('The middleware must not continue the execution if there is no user role (Error 401)', () => {
        const request = { headers: {} }
        const response = mockResponse()
        const next = jest.fn();

        checkUserRole(['ADMIN'])(request, response, next);

        // Wait for the function not to be invoked
        expect(next).not.toBeCalled();

        // Wait for a 401 status response
        expect(response.status).toHaveBeenCalledWith(401);

        // Wait for the json response as invalid
        expect(response.json).toHaveBeenCalledWith({
            message: 'Invalid credentials'
        });
    });
})