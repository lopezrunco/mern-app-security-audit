const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
};

export const getTodayES = () => {
    return new Date().toLocaleDateString("es-UY", options)
}