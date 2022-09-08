import { DB } from '../../../db'
import { WithOptional } from '../../../types/utils'

export const userActions = {
  /**
   * Returns a user by id from the "users" table
   * @param {number} id
   * @returns {Promise<(UserModel.Info | undefined)>}
   */
  'GET users/{userId}': async (userId: UserModel.Info['id']) => {
    return await DB.users.get(userId)
  },

  /**
   * Updates the user or creates a new one (if the user's id is not provided)
   * in the "users" table
   * @param {UserModel.Info} user
   * @returns {Promise<number>}
   */
  'PUT users/{user}': async (user: WithOptional<UserModel.Info, 'id'>) => {
    const id = await DB.users.put(user as UserModel.Info)
    const result: UserModel.Info = { ...user, id }

    return result
  },

  /**
   * Removes a user by id from the "users" table
   * @todo Remove user's journal records, meals, products, recipes and goals
   * @param {number} id
   * @returns {Promise<void>}
   */
  'DELETE users/{userId}': async (userId: UserModel.Info['id']) => {
    return await DB.users.delete(userId)
  },

  /**
   * Returns a list of users from the "users" table
   * @returns {Promise<UserModel.Info[]>}
   */
  'GET users': async () => {
    return await DB.users.toArray()
  },

  /**
   * Returns the user's goals from the "goals" table
   * @param {number} id
   * @returns {Promise<(UserModel.Goals | undefined)>}
   */
  'GET users/{userId}/goals': async (userId: UserModel.Info['id']) => {
    return await DB.goals.get({ userId })
  },

  /**
   * Updates the user's goals
   * @param {UserModel.Goals} goals
   * @returns {Promise<(UserModel.Goals | undefined)>}
   */
  'PUT goals/{goals}': async (goals: UserModel.Goals) => {
    await DB.goals.put(goals)

    return goals
  }
}
