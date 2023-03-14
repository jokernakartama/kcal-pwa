import { Accessor, batch, createSignal } from 'solid-js'
import { DEFAULT_LIST_PARAMS } from '../constants/pagination'
import { PaginationParams, PaginationResponse } from '../types/pagination'

export type FetchFunction<T> = (
  params: PaginationParams
) => Promise<PaginationResponse<T>>

type goToPageFunction<T> =
  & ((page: 'next' | 'prev') => Promise<T[]>)
  & ((page: PaginationParams, resetMeta?: boolean) => Promise<T[]>)

export type PaginationHookData<T> = [
  goToPage: goToPageFunction<T>,
  meta: {
    offset: Accessor<number>
    limit: Accessor<number>
    total: Accessor<number | undefined>
  }
]

export function getMaxOffset(total: number, limit: number) {
  return Math.floor(total / limit) * limit
}

/**
 * Provides a fetch function and page metadata, manages pagination states
 */
export function createPagination<T>(
  fetchFn: FetchFunction<T>,
  options?: { limit?: number }
): PaginationHookData<T> {
  const [offset, setOffset] = createSignal<number>(DEFAULT_LIST_PARAMS.offset)
  const [limit, setLimit] = createSignal<number>(
    options?.limit ?? DEFAULT_LIST_PARAMS.limit
  )
  const [total, setTotal] = createSignal<number | undefined>()

  /**
   * Updates total and offset (calculates the proper offset value)
   */
  function setMeta(nextTotal: number) {
    setTotal(nextTotal)

    if (offset() > nextTotal) {
      setOffset(getMaxOffset(nextTotal, limit()))
    }
  }

  /**
   * General fetch function
   * @param {PaginationParams} params - Pagination params
   * @param {number} [params.offset]
   * @param {number} [params.limit]
   * @param {boolean} resetMeta - Whether the request should be considered as
   * completely new
   * @returns {Promise}
   */
  function refetch(params: PaginationParams, resetMeta: boolean) {
    if (resetMeta) {
      batch(() => {
        if (typeof params.offset !== 'undefined') setOffset(params.offset)
        if (typeof params.limit !== 'undefined') setLimit(params.limit)
        setTotal(undefined)
      })
    }

    return fetchFn({
      offset: params.offset ?? offset(),
      limit: params.limit ?? limit()
    })
      .then((res) => {
        setMeta(res.total)

        return res.items
      })
      .catch(err => {
        throw err
      })
  }

  /**
   * Loads the next page and updates the offset
   */
  function next() {
    // Add possibility to get the very first page, when total is not set yet
    if (total()) {
      setOffset(v => Math.min(
        v + limit(),
        getMaxOffset(total()!, limit())
      ))
    }

    return refetch({
      limit: limit()
    }, false)
  }

  /**
   * Loads the previous page and updates the offset
   */
  function prev() {
    setOffset(v => Math.max(v - limit(), 0))

    return refetch({
      limit: limit()
    }, false)
  }

  /**
   * Manages pagination meta and fetches pages' content
   * @param {('next' | 'prev')} page - If next/prev is used, limit and offset,
   * but not total will be set
   * @param {PaginationParams} page - If pagination params are used, no meta
   * will be set unless you have used the second parameter: `resetMeta`
   * @param {boolean} [resetMeta=false] - Whether limit/offset should be updated
   * and total should be reset to `undefined`
   * @returns {Promise}
   */
  function go(page: 'next' | 'prev'): Promise<T[]>
  function go(page: PaginationParams, resetMeta: boolean): Promise<T[]>
  function go(page: PaginationParams | 'next' | 'prev', resetMeta = false): Promise<T[]> {
    if (page === 'next') {
      return next()
    }
    if (page === 'prev') {
      return prev()
    }

    return refetch(page, resetMeta)
  }

  return [
    go,
    {
      offset, limit, total
    }
  ]

}
