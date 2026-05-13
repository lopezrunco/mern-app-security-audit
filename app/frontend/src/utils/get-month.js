export const getMonth = (monthNumber) => {
    const date = new Date()
    date.setMonth(monthNumber - 1)
    return date.toLocaleString('es-UY', { month: 'long' })
}
