const otplib = require('otplib')
const qrcode = require('qrcode')
const crypto = require('crypto')
const { userModel } = require('../../models/user')

otplib.authenticator.options = { crypto }

// This controller is called from UI to enable multifactor
// It's called from a logged user, so it can obtain the user data previously setted in the middleware
module.exports = (request, response) => {
    const secret = otplib.authenticator.encode(crypto.randomBytes(32).toString('hex').substr(0, 20))

    // This data will be showed in the authentication app
    const email = request.user.email
    const service = 'Campo Eventos web'

    const otpAuth = otplib.authenticator.keyuri(email, service, secret)

    // With the received data, this function generates a QR (base64)
    qrcode.toDataURL(otpAuth) // Generates the QR
        .then(qr => {
            // With the obtained QR, seek the user by ID (setted in the token inserted in the middleware)
            // Enables the MFA only if it's desabled
            // Update to "MFA enabled" and inserts the secrey key
            userModel.findOneAndUpdate({ _id: request.user.id, mfaEnabled: false }, { mfaEnabled: true, mfaSecret: secret })
                .then((user) => {
                    // If the users exists, return the QR and the secret key
                    if (user) {
                        response.json({
                            qr,
                            secret
                        })
                    } else {
                        response.json({
                            message: 'Could not enable MFA'
                        })
                    }
                }).catch(error => {
                    console.error('Error trying to enable MFA => ', error)
                    response.status(500).json({
                        message: 'Error trying to enable MFA'
                    })
                })
        }).catch(error => {
            console.error('Error trying to generate QR => ', error)
            response.status(500).json({
                message: 'Error trying to generate QR'
            })
        })
}