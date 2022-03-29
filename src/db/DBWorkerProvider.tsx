import { Component, createContext, useContext } from 'solid-js'
import { WorkerClient } from '../utils/queryableWorker'
import { dbWorkerActions } from '../workers/db/actions'
import { DBWorkerContextType } from './types'

const DBWorkerClient = new WorkerClient(
  new Worker(new URL('../workers/db', import.meta.url))
)
const DBWorkerContext = createContext<
  DBWorkerContextType<typeof dbWorkerActions>
>(DBWorkerClient)

/**
 * Returns DBWorker API
 */
export const useDB = () => {
  const db = useContext(DBWorkerContext)

  return {
    dispatch: db.dispatch.bind(db) as typeof db.dispatch,
    terminate: db.terminate.bind(db) as typeof db.terminate,
    post: db.post.bind(db) as typeof db.post
  }
}

/**
 * A component that provides DBWorker context
 */
export const DBWorkerProvider: Component = props => {
  return (
    <DBWorkerContext.Provider value={DBWorkerClient}>
      {props.children}
    </DBWorkerContext.Provider>
  )
}
