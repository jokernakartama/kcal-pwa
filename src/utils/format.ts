/**
 * Trims a string and turns it to lowercase
 * @param {string} str
 * @returns {string}
 */
export function normalizeString(str: string) {
  return str.trim().toLowerCase()
}

/**
 * Converts a date to YYYY-MM-DD string
 * @param {Date} date
 * @returns {string}
 */
export function normalizeDate(date: Date) {
  const YY = date.getFullYear()
  const MM = date.getMonth() + 1
  const DD = date.getDate()

  return `${YY}-${MM < 10 ? `0${MM}` : MM}-${DD < 10 ? `0${DD}` : DD}`
}

/**
 * Converts a date to HH:mm string
 * @param {Date} date
 * @returns {string}
 */
export function normalizeTime(date: Date) {
  const HH = date.getHours()
  const mm = date.getMinutes()

  return `${HH < 10 ? `0${HH}` : HH}:${mm < 10 ? `0${mm}` : mm}`
}

/**
 * Converts the number like Number.toFixed but without changing the type
 * @param {number} value
 * @param {number} [fractionDigits] - Number of digits after the decimal point
 * @returns {number}
 */
export function roundTo(value: number, fractionDigits = 0) {
  const multiplicator = 10 ** fractionDigits
  return Math.round(value * multiplicator) / multiplicator
}
