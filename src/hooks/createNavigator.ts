import {
  NavigateOptions,
  SetParams,
  useLocation,
  useNavigate
} from '@solidjs/router'
import { injectParams, mergeSearchString } from '../utils/routing'

export type NavigateOptionsWithQuery = Partial<
NavigateOptions & { query: SetParams }
>

/**
 * An advanced hook of navigation that adds features to navigate backwards
 * and resolve relative paths (`@ssolidjs/router` has this feature,
 * but it doesn't work with the exact routing configuration).
 * @returns {Function}
 */
export function createNavigator() {
  const navigate = useNavigate()
  const routeLocation = useLocation()

  /**
   * Navigates back and forth
   * @param {string} to - Relative or absolute path
   * @param {Object} [options]
   */
  function goTo(to: string, options?: NavigateOptionsWithQuery): void
  /**
   * Navigates back and forth
   * @param {string} to - Relative or absolute path
   * @param {number} [delta] - This param is used when it is needed to rewind the history
   * @param {Object} [options]
   */
  function goTo(
    to: string,
    delta?: number,
    options?: NavigateOptionsWithQuery
  ): void
  function goTo(
    to: string,
    param1?: number | NavigateOptionsWithQuery,
    param2?: NavigateOptionsWithQuery
  ) {
    let route: string = to
    const delta = (
      typeof param1 === 'number' &&
      !isNaN(param1) &&
      isFinite(param1)
    ) ? param1 : 0
    const options: NavigateOptionsWithQuery = (
      typeof param1 === 'number' || param2 ? param2 : param1
    ) || {}

    if (options.resolve) {
      const parentPath = routeLocation.pathname

      route = injectParams(
      // Remove a trailing slash
        `${parentPath.endsWith('/') ? parentPath.slice(0, -1) : parentPath}/*`,
        { wild: to }
      )
    }

    if (delta) {
      // Fint ushami to implement app-like navigation
      navigate(delta)
      options.replace = true
    }

    if (options.query) {
      route += mergeSearchString(routeLocation.search, options.query)
    }

    // Use timeout to immediately change the route after goin back and cut off
    // the navigation history
    window.setTimeout(() => {
      navigate(route + routeLocation.hash, options)
    }, 10)
  }

  return goTo
}
