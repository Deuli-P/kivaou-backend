export const regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

export const regexPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,32}$/;


export const formatDateLong = (date) => {
    const d = new Date(date);
    return `${d.getDate()} ${d.toLocaleString('fr-FR', {day:'numeric', month: 'long' })} ${d.getFullYear()}`;
}

export const formatDate = (date) => {
  const d = new Date(date);
  return `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`;
}

export const formatTime = (date) => {
    const d = new Date(date);
    return `${d.getHours()}h${d.getMinutes()}`;
}
