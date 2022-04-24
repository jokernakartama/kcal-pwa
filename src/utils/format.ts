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
