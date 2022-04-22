import { Collection } from 'dexie'
import { PaginationResponse, PaginationParams } from '../../types/pagination'
import { ExtractCollectionDataType } from '../../types/utils'
import { SortingParams } from './types'

/**
 * Counts the total records amount and applies pagination
 * params to the collection
 * @param {Collection} collection
 * @param {PaginationParams} params
 * @returns {Promise<PaginationResponse>}
 */
export function getPaginatedResponse<
  C extends Collection,
  P extends PaginationParams
>(
  collection: C,
  params?: P
): Promise<PaginationResponse<ExtractCollectionDataType<C>>> {
  let nextCollection = collection.clone()

  if (params?.offset !== undefined) {
    nextCollection = nextCollection.offset(params.offset)
  }

  if (params?.limit !== undefined) {
    nextCollection = nextCollection.limit(params.limit)
  }

  return Promise.all([
    collection.count(),
    (nextCollection as Awaited<C>).toArray()
  ])
    .then(([total, items]) => {
      return { total, items }
    })
}

/**
 * Reverses the collection if it is required
 * @param {Collection} collection
 * @param {SortingParams} params
 * @returns {Collection}
 */
export function handleSortParams<
  C extends Collection,
  P extends SortingParams<any>
>(
  collection: C,
  params?: P
): C {
  let nextCollection: Collection = collection.clone()

  if (params?.dir === 'desc') {
    nextCollection = nextCollection.reverse()
  }

  return nextCollection as Awaited<C>
}
