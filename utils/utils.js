import executeQuery from './dbReader.js'
import path from "path";

export const regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

export const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])/;

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


export const getUserById = async (id) => {
  const filePath = path.join("queries/users/getUserById.sql");
  const result = await executeQuery(filePath, [userId]);
  return result[0] || null;
}
