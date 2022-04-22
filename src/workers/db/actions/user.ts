import { DB } from '../../../db'
import { WithOptional } from '../../../types/utils'

export const userActions = {
  /**
   * Returns a user by id from the "users" table
   * @param {number} id
   * @returns {Promise<(UserModel.Info | undefined)>}
   */
  'GET user/{userId}': (userId: UserModel.Info['id']) => {
    return DB.users
      .get(userId)
  },

  /**
   * Updates the user or creates a new one (if the user's id is not provided)
   * in the "users" table
   * @param {UserModel.Info} user
   * @returns {Promise<number>}
   */
  'PUT user/{user}': (user: WithOptional<UserModel.Info, 'id'>) => {
    return DB.users
      .put(user as UserModel.Info)
  },

  /**
   * Removes a user by id from the "users" table
   * @param {number} id
   * @returns {Promise<void>}
   */
  'DELETE user/{userId}': (userId: UserModel.Info['id']) => {
    return DB.users
      .delete(userId)
  },

  /**
   * Returns a list of users from the "users" table
   * @returns {Promise<UserModel.Info[]>}
   */
  'GET users': () => {
    return DB.users
      .toArray() as Promise<UserModel.Info[]>
  },

  /**
   * Returns the user's goals from the "goals" table
   * @param {number} id
   * @returns {Promise<(UserModel.Goals | undefined)>}
   */
  'GET user/{userId}/goals': (userId: UserModel.Info['id']) => {
    return DB.goals.get({ userId })
  },

  /**
   * Updates the user's goals
   * @param {UserModel.Goals} goals
   * @returns {Promise<(UserModel.Goals | undefined)>}
   */
  'PUT goals/{goals}': (
    goals: UserModel.Goals
  ) => {
    return DB.goals.put(goals)
  }
}
