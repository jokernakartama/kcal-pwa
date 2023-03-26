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
  return date.toISOString().slice(0, 10)
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
