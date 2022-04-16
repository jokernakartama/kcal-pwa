import { WorkerClient } from '../utils/queryableWorker'
import { dbWorkerActions } from '../workers/db/actions'

const DBWorkerClient = new WorkerClient<typeof dbWorkerActions>(
  new Worker(new URL('../workers/db', import.meta.url))
)

/**
 * Creates a new user
 * @param {UserModel.Info} fields - User info (without id)
 * @returns {Promise<UserModel.Info>}
 */
export function createUser(
  fields: Omit<UserModel.Info, 'id'>
): Promise<UserModel.Info>{
  return DBWorkerClient.dispatch('setUser', fields)
    .then(id => {
      return { ...fields, id }
    })
}

/**
 * Updates user info
 * @param {UserModel.Info} user
 * @returns {Promise<UserModel.Info>}
 */
export function setUser(user: UserModel.Info): Promise<UserModel.Info> {
  return DBWorkerClient.dispatch('setUser', user)
    .then(() => user)
}

/**
 * Gets user info
 * @param {number} id
 * @returns {Promise<UserModel.Info | undefined>}
 */
export function getUser(
  id: UserModel.Info['id']
): Promise<UserModel.Info | undefined> {
  return DBWorkerClient.dispatch('getUser', id)
}

/**
 * Returns a list of users
 * @returns {Promise<UserModel.Info[]>}
 */
export function getUsers(): Promise<UserModel.Info[]> {
  return DBWorkerClient.dispatch('getUsersList')
}

/**
 * Returns the user's goals fo nutrition
 * @returns {Promise<UserModel.Goals | undefined>>}
 */
export function getUserGoals(
  userId: UserModel.Info['id']
): Promise<UserModel.Goals | undefined> {
  return DBWorkerClient.dispatch('getUserGoals', userId)
}
