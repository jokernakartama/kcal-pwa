/**
 * Adds substracts years to a date
 * @param {number} years - Number of years
 * @param {Date} [date] - The date to add/substract
 * @returns
 */
export function addYearsToDate(years: number, date: Date = new Date()) {
  return new Date((new Date()).setFullYear((date).getFullYear() + years))
}
