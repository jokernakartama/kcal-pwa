import { WorkerActionsMap, WorkerClientInstance } from '../utils/queryableWorker'

export interface DBWorkerContextType<
  R extends WorkerActionsMap
> extends WorkerClientInstance<R> {

}
