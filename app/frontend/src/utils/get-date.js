import { getMonth } from "./get-month"

export const getDate = (timeStamp) => {
    let day = new Date(timeStamp).getDate()
    let month = getMonth(new Date(timeStamp).getMonth() + 1)
    let hour = new Date(timeStamp).toLocaleString("es-uy", { hour: '2-digit', minute: '2-digit' });
    return `${day} de ${month}, ${hour} hrs.`
}
