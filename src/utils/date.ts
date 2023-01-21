/**
 * Adds substracts years to a date
 * @param {number} years - Number of years
 * @param {Date} [date] - The date to add/substract
 * @returns
 */
export function addYearsToDate(years: number, date: Date = new Date()) {
  return new Date((new Date()).setFullYear((date).getFullYear() + years))
}

/**
 * Calculates difference between two dates in ms
 * @param {Date} higher - The higher date (the newer one)
 * @param {Date} lower  - The higher date (the older one)
 * @returns {number}
 */
export function getDiffInMs(higher: Date, lower: Date) {
  return higher.getTime() - lower.getTime()
}

/**
 * Calculates difference between two dates in years
 * @param {Date} higher - The higher date (the newer one)
 * @param {Date} lower  - The higher date (the older one)
 * @returns {number} Non-integer value
 */
export function getDiffInYears(higher: Date, lower: Date) {
  return getDiffInMs(higher, lower) / (1000 * 60 * 60 * 24 * 365.25)
}
