/**
 * @typedef {Object} PaginationResponse
 * @property {number} total
 * @property {Array} items
 */
export interface PaginationResponse<T> {
  total: number
  items: T[]
}

/**
 * @typedef {Object} PaginationParams
 * @property {number} [limit]
 * @property {number} [offset]
 */
export interface PaginationParams {
  limit?: number
  offset?: number
}

/**
 * @typedef {('asc' | 'desc')} PaginationParams
 */
export type SortingDirection = 'asc' | 'desc'
