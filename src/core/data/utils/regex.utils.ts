/**
 * Escapes special characters in a string for use in a API request
 * @param {string} value - The string to be escaped
 * @returns {string} The escaped string
 */
export const escapeRegExpForApiRequest = (value: string) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Returns the id from a url if it matches the format /<id>/
 * If the url does not match the format, returns 1
 * @param {string} [url] - The url to extract the id from
 * @returns {number} The id from the url or 1 if no match
 */
export const getIdFromUrl = (url?: string) => {
  if (!url) {
    return 1
  }

  const match = url.match(/\/(\d+)\/$/)
  return match ? Number(match[1]) : 1
}
