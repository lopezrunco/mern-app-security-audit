let id = 0

export const getUniqueId = () => {
    id = id + 13
    const dateString = Date.now().toString(36)
    const randomness = Math.random().toString(36).substr(2)
    return dateString + randomness + id
}