import { SetParams } from '@solidjs/router'
import { RouteParams, inject } from 'regexparam'

/**
 * Safely removes segments from a pathname
 * @param {string} pathname - Original pathname
 * @param {...string} segments
 * @returns {string} If one of segments isn't found returns the original,
 * pathname
 */
export function substractSegments(pathname: string, ...segments: string[]) {
  try {
    return segments.reduce((result, segment) => {
      if (result.endsWith(segment)) {
        return result.slice(0, -(segment.length + 1))
      }

      throw new Error(`Segment "${segment}" is not found in path "${pathname}"`)
    }, pathname)
  } catch (err) {
    console.error(err)
    return pathname
  }
}

/**
 * A wrapper over `regexparam.inject` that removes the leading slash in case
 * if the original route doesn't have one
 * @param {string} route
 * @param {Object} values
 * @returns
 */
export function injectParams<T extends string>(route: T, values: RouteParams<T>) {
  const pathname = inject(route, values)
  if (!route.startsWith('/') && pathname.startsWith('/')) {
    return pathname.slice(1)
  }

  return pathname
}

/**
 * @see https://github.com/solidjs/solid-router/blob/main/src/utils.ts#L152
 */
export function mergeSearchString(search: string, params: SetParams) {
  const merged = new URLSearchParams(search)
  Object.entries(params).forEach(([key, value]) => {
    if (value == null || value === '') {
      merged.delete(key)
    } else {
      merged.set(key, String(value))
    }
  })
  const s = merged.toString()
  return s ? `?${s}` : ''
}
