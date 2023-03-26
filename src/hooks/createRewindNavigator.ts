import { NavigateOptions, useNavigate } from '@solidjs/router'

/**
 * A shortcut hook that can partially remove and rewrite navigation history
 * @returns {Function}
 */
export function createRewindNavigator() {
  const navigate = useNavigate()

  function rewind(
    to: string,
    delta = 0,
    options: Partial<NavigateOptions> = { replace: true }
  ) {
    navigate(delta)
    navigate(to, {
      ...(options ?? {}),
      replace: true
    })
  }

  return rewind
}
