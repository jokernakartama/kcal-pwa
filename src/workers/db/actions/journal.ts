import Dexie from 'dexie'
import { DB } from '../../../db'
import { WithOptional } from '../../../types/utils'
import { normalizeDate } from '../../../utils/format'

export const journalActions = {
  /**
   * Returns the user's journal record by date
   * @param {number} userId
   * @param {ListParams} params
   * @returns {Promise<(DataModel.JournalRecord[])>}
   */
  'GET users/{userId}/journal': async (
    userId: UserModel.User['id'],
    date: DataModel.JournalRecord['date']
  ) => {
    return await DB.journal
      .where('[userId+date]')
      .equals([userId, date])
      .first()
  },

  /**
   * Clears the user's journal
   * @param {number} userId
   * @returns {Promise<undefined>}
   */
  'DELETE users/{userId}/journal': async (
    userId: UserModel.User['id']
  ) => {
    try {
      await DB.journal
        .where('userId')
        .equals(userId)
        .delete()

      await DB.meals
        .where('userId')
        .equals(userId)
        .delete()
    } catch (e) {
      // Ignore errors of removing non existed meals
      if (!(e instanceof Dexie.ModifyError)) {
        throw e
      }
    }
  },

  /**
   * Returns corresponding meals
   * @param {number} recordId
   * @returns {Promise<DataModel.Meal[]>}
   */
  'GET journal/{recordId}/meals': async (
    recordId: DataModel.JournalRecord['id']
  ) => {
    return await DB.meals
      .where('recordId')
      .equals(recordId)
      .toArray()
  },

  /**
   * Adds a meal to journal
   * @param {DataModel.Meal} meal
   * @returns {Promise<(number | undefined)>}
   */
  'PUT meals/{meal}': async (
    meal: WithOptional<DataModel.Meal, 'id' | 'recordId'>
  ) => {
    const time = new Date()

    if (meal.time) {
      time.setHours(meal.time.getHours())
      time.setMinutes(meal.time.getMinutes())
    }

    const date = normalizeDate(time)
    const record = await DB.journal
      .where({ userId: meal.userId, date })
      .first()
    let recordId = record?.id

    if (record === undefined) {
      recordId = await DB.journal.put(
        {
          userId: meal.userId,
          date
        } as const as DataModel.JournalRecord
      )
    }

    if (recordId !== undefined) {
      const id = await DB.meals
        .put({ ...meal, recordId, time } as const as DataModel.Meal)
      const result: DataModel.Meal = { ...meal, id, recordId, time }

      return result
    }

    throw new Dexie.NotFoundError()
  },

  /**
   * Removes the meal
   * @param {number} mealId
   * @returns {Promise<(number | undefined)>}
   */
  'DELETE meals/{mealId}': async (
    mealId: DataModel.Meal['id']
  ) => {
    return await DB.meals
      .delete(mealId)
  }
}
