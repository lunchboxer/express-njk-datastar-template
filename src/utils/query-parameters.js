import { parse, format } from 'node:url'

/**
 * Add a query parameter to the given URL.
 * @param {string} urlString - The URL string to which the query parameter will be added.
 * @param {string} key - The key of the query parameter to add.
 * @param {string} value - The value of the query parameter to add.
 * @returns {string} The updated URL string with the added query parameter.
 */
export function addQueryParam(urlString, key, value) {
  const parsedUrl = parse(urlString, true)
  parsedUrl.query[key] = value

  const updatedUrl = format({
    pathname: parsedUrl.pathname,
    query: parsedUrl.query,
  })

  return updatedUrl
}
