const DEFAULT_SEPARATOR = '~'

/**
 * Generates a unique (kinda) action name
 * @param {string} action
 * @param {string} [separator='~']
 * @returns {string}
 */
export function encodeActionName(
  action: string,
  separator: string = DEFAULT_SEPARATOR
): string {
  return `${action}${separator}${Date.now()}_${Math.random()}`
}

/**
 * Extacts the original action name
 * @param {string} action
 * @param {string} [separator='~']
 * @returns {string}
 */
export function decodeActionName(
  action: string,
  separator: string = DEFAULT_SEPARATOR
): string {
  return action.split(separator)[0]
}
