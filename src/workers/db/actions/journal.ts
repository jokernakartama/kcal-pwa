import Dexie from 'dexie'
import { DB } from '../../../db'
import { PaginationParams } from '../../../types/pagination'
import { WithOptional } from '../../../types/utils'
import { normalizeDate } from '../../../utils/format'
import { getPaginatedResponse, handleSortParams } from '../helpers'
import { SortingParams } from '../types'

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
    recordId: DataModel.JournalRecord['id'],
    params?: PaginationParams & SortingParams<DataModel.Meal>
  ) => {
    const collection = DB.meals
      .where('recordId')
      .equals(recordId)

    return await getPaginatedResponse(
      handleSortParams(collection, params),
      params
    )
  },

  /**
   * Adds a meal to a journal record
   * @param {DataModel.Meal} meal
   * @returns {Promise<(number | undefined)>}
   */
  'PUT meals/{meal}': async (
    meal: WithOptional<DataModel.Meal, 'recordId' | 'id'>
  ) => {
    const date = normalizeDate(meal.time)
    const record = meal.recordId === undefined
      ? undefined
      : await DB.journal.get(meal.recordId)
    let recordId = record?.id

    if (record === undefined || record.date !== date) {
      recordId = await DB.journal.put(
        {
          userId: meal.userId,
          date: normalizeDate(meal.time)
        } as const as DataModel.JournalRecord
      )
    }

    if (recordId !== undefined) {
      const id = await DB.meals
        .put(
          {
            ...meal as DataModel.Meal,
            recordId
          }
        )
      const result: DataModel.Meal = { ...meal, id, recordId }

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
