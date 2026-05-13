import { LOGOUT, REFRESH_TOKEN } from "../utils/action-types"
import { apiUrl } from "./api-url"

export const refreshToken = (token, dispatch, navigate, callback) => {
    // Call refresh token endpoint passing the refresh token
    fetch(apiUrl('auth/refresh'), {
        headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
        }
    }).then(response => {
        if (response.ok) {
            return response.json()
        } else {
            throw response
        }
    }).then(response => {
        dispatch({
            type: REFRESH_TOKEN,
            payload: response
        })
        // Callback funcion callback to reuse on different contexts (only will be applied if comes as a parameter)
        if (callback) {
            callback()
        }
    }).catch(error => {
        console.error(error)
        dispatch({
            type: LOGOUT
        })
        navigate('/login')
    })
}