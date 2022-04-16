import { DB } from '../../../db'
import { WithOptional } from '../../../utils/utilityTypes'

// interface ListParams<T> {
//   limit?: number
//   offset?: number
//   order?: 'asc' | 'desc'
//   sort?: keyof T
// }

// type ListEntity = 'JournalRecord' | 'Meal' | 'Product' | 'Recipe'

// const SAMPLE_PROFILE: UserModel.Info = {
//   id: 3,
//   name: 'Zzap',
//   sex: 'male',
//   birthDate: '1989-12-23T00:00:00.000Z',
//   weight: 70,
//   height: 178,
//   activity: 1.375,
//   goal: 0
// }

// const DEFAULT_LIST_PARAMS = {
//   limit: 20,
//   offset: 0
// }

export const dbWorkerActions = {
  /**
   * Returns a user by id from the "users" table
   * @param {number} id
   * @returns {Promise<(UserModel.Info | undefined)>}
   */
  getUser(id: UserModel.Info['id']) {
    return DB.users
      .get(id)
  },

  /**
   * Updates the user or creates a new one (if the user's id is not provided)
   * in the "users" table
   * @param {UserModel.Info} user
   * @returns {Promise<number>}
   */
  setUser(user: WithOptional<UserModel.Info, 'id'>) {
    return DB.users
      .put(user as UserModel.Info, user.id)
  },

  /**
   * Removes a user by id from the "users" table
   * @param {number} id
   * @returns {Promise<void>}
   */
  deleteUser(id: UserModel.Info['id']) {
    return DB.users
      .delete(id)
  },

  /**
   * Returns a list of users from the "users" table
   * @returns {Promise<UserModel.Info[]>}
   */
  getUsersList() {
    return DB.users
      .toArray() as Promise<UserModel.Info[]>
  },

  /**
   * Returns the user's goals from the "goals" table
   * @param {number} userId
   * @returns {Promise<(UserModel.Goals | undefined)>}
   */
  getUserGoals(userId: UserModel.Info['id']) {
    return DB.goals.get({ userId })
  }
}
