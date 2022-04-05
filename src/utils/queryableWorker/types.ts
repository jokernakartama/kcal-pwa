export type WorkerActionsMap = Record<string, ((...args: any[]) => any | Promise<any>)>

export interface WorkerClientInstance<
  R extends WorkerActionsMap
> {
  /** Aborts worker's associated global environment */
  terminate: () => void

  /** Post a message, an object that contains two keys:
   * - queryAction: the action's name
   * - queryActionArguments: arguments for the action's handler
   */
  dispatch: <A extends keyof R>(
    action: A,
    ...args: Parameters<R[A]>
  ) => Promise<ReturnType<R[A]>>

  /**
   * Just the ordinary way to post a message
   */
  post: (message: any) => void
}
