import { encodeActionName } from './helpers'
import { WorkerClientInstance } from './types'

/**
 * Creates a configurable worker
 */
export class WorkerClient<
  R extends Record<string, ((...args: any[]) => any)>
> implements WorkerClientInstance<R> {
  private readonly worker: Worker

  constructor(
    worker: Worker,
    onError?: (err: ErrorEvent) => void
  ) {
    this.worker = worker
    this.worker.onerror = onError ?? (() => {})
  }

  /**
   * Adds a listener that handles only the specified action
   * @param {string} action
   * @param {Function} cb - Action data callback
   */
  private listen(action: keyof R, cb: (data: ReturnType<R[keyof R]>) => void) {
    const handler = (e: MessageEvent) => {
      const data = e.data as Record<string, any> | undefined

      if (data instanceof Object && data?.queryActionListener !== undefined) {
        if (action === data.queryActionListener) {
          this.worker.removeEventListener('message', handler)
          cb.call(this, data.queryActionResult)
        }

        return
      }

      throw TypeError('Unknown action')
    }

    this.worker.addEventListener('message', handler)
  }

  public post(message: any) {
    this.worker.postMessage(message)
  }

  public dispatch<A extends keyof R>(action: A, ...args: Parameters<R[A]>) {
    const actionPromise = new Promise<Awaited<ReturnType<R[A]>>>((resolve, reject) => {
      if (typeof action !== 'string') {
        reject(
          new TypeError(
            'WorkerClient.dispatch requires an action as an argument'
          )
        )

        return
      }

      const actionName = encodeActionName(action)

      this.listen(actionName, resolve)

      this.worker.postMessage({
        queryAction: actionName,
        queryActionArguments: args as any[]
      })
    })

    return actionPromise
  }

  public terminate() {
    this.worker.terminate()
  }
}
