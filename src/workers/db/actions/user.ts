import { DB } from '../../../db'
import { WithOptional } from '../../../utils/utilityTypes'

export const userActions = {
  /**
   * Returns a user by id from the "users" table
   * @param {number} id
   * @returns {Promise<(UserModel.Info | undefined)>}
   */
  'GET user/{id}': (id: UserModel.Info['id']) => {
    return DB.users
      .get(id)
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
  'DELETE user/{id}': (id: UserModel.Info['id']) => {
    return DB.users
      .delete(id)
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
   * @param {number} userId
   * @returns {Promise<(UserModel.Goals | undefined)>}
   */
  'GET user/{id}/goals': (id: UserModel.Info['id']) => {
    return DB.goals.get({ userId: id })
  },

  /**
   * Updates the user's goals
   * @param {number} userId
   * @returns {Promise<(UserModel.Goals | undefined)>}
   */
  'PUT user/{id}/goals': (
    userId: UserModel.Info['id'],
    goals: WithOptional<UserModel.Goals, 'userId'>
  ) => {
    return DB.goals.put({ ...goals, userId })
  },
}
