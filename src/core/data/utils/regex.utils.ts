/**
 * Escapes special characters in a string for use in a API request
 * @param {string} value - The string to be escaped
 * @returns {string} The escaped string
 */
export const escapeRegExpForApiRequest = (value: string) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}