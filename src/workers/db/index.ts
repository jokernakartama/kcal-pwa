import { initWorkerServer } from '../../utils/queryableWorker'
import { dbWorkerActions } from './actions'

initWorkerServer(dbWorkerActions)
