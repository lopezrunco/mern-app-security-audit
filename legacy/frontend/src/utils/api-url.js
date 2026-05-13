const API_BASE_URL = import.meta.env.VITE_API_URL

// Returns the API request string
export const apiUrl = (path) => {
    if (!path.startsWith('/')) {
        path = `/${path}`
    }
    return `${API_BASE_URL}${path}`
}
