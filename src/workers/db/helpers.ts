import { Collection } from 'dexie'
import { ListPagination, ListSorting } from './types'

export function handlePaginationParams<
  C extends Collection,
  P extends ListPagination
>(
  collection: C,
  params?: P
): C {
  let nextCollection = collection.clone()

  if (params?.offset !== undefined) {
    nextCollection = nextCollection.offset(params.offset)
  }

  if (params?.limit !== undefined) {
    nextCollection = nextCollection.limit(params.limit)
  }

  return nextCollection as Awaited<C>
}

export function handleSortParams<
  C extends Collection,
  P extends ListSorting<any>
>(
  collection: C,
  params?: P
) {
  let nextCollection = collection.clone()

  if (params?.order === 'desc') {
    nextCollection = nextCollection.reverse()
  }

  if (params?.sort !== undefined && typeof params.sort === 'string') {
    return nextCollection.sortBy(params.sort)
  }

  return nextCollection.toArray()
}
