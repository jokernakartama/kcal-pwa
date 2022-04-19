import { DB } from '../../../db'
import { WithOptional } from '../../../utils/utilityTypes'
import { DEFAULT_LIST_PARAMS } from '../constants'
import { handlePaginationParams, handleSortParams } from '../helpers'
import { ListParams } from '../types'

export const journalActions = {
/**
   * Returns the user's journal records
   * @param {number} userId
   * @param {Object} [filter] - "From" and "to" dates
   * @param {ListParams} params
   * @returns {Promise<(DataModel.JournalRecord[])>}
   */
  'GET user/{userId}/journal': (
    userId: UserModel.Info['id'],
    params: ListParams<DataModel.JournalRecord> = DEFAULT_LIST_PARAMS
  ) => {
    const dateFrom = params?.from !== undefined ? new Date(params.from) : undefined
    const dateTo = params?.to !== undefined ? new Date(params.to) : undefined
    const collection = DB.journal
      .where(['userId', 'date'])
      .between([userId, dateFrom], [userId, dateTo], true, true)

    return handleSortParams(
      handlePaginationParams(collection, params),
      params
    )
  },

  /**
 * Updates or creates a journal record
 * @param {DataModel.JournalRecord} record
 * @returns {Promise<number>}
 */
  'PUT journal/{record}': (
    record: WithOptional<DataModel.JournalRecord, 'id'>
  ) => {
    return DB.journal
      .put(record as DataModel.JournalRecord)
  },

  /**
 * Returns corresponding meals
 * @param {string} id - Journal record id
 * @returns {Promise<(DataModel.Meal[])>}
 */
  'GET journal/{id}/meals': (
    id: DataModel.JournalRecord['id'],
  ) => {
    return DB.meals
      .where('dayId').equals(id)
      .toArray()
  }
}
