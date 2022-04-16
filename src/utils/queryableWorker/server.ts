import { decodeActionName } from './helpers'

function reply<T>(action: string, data: T) {
  self.postMessage(
    {
      queryActionListener: action,
      queryActionResult: data
    }
  )
}

/**
 * Initiates a worker script
 * @param {Object<string, Function>} actions - Map of actions
 */
export const initWorkerServer = <
  A extends Record<string,((...args: any[]) => any)>
>(actions: A) => {
  self.onmessage = (e: MessageEvent) => {
    const data = e.data as Record<string, any> | undefined

    if (!(data instanceof Object) || typeof data?.queryAction !== 'string') {
      return
    }

    const action = decodeActionName(data.queryAction)

    if (!(action in actions)) {
      console.warn(`Unknown action: ${action}`)
      return
    }

    if (
      data?.queryActionArguments !== undefined
    ) {
      Promise.resolve()
        .then(() => {
          return actions[action as keyof A]
            .apply(self, data.queryActionArguments) as ReturnType<A[keyof A]>
        })
        .then((result) => {
          reply(data.queryAction as string, result)
        })
        .catch((err) => {
          throw err
        })
    }
  }
}
