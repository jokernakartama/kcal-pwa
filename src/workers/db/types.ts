import { PaginationParams, SortingDirection } from '../../types/pagination'

/**
 * An object that has the "id" key
 * @typedef {Object} IndexedObject
 * @property {string} id
 */
interface IndexedObject { id: string | number; [key: string]: any }

type IndexedObjectValue<P> = P extends Array<(infer ElementType)>
  ? ElementType extends IndexedObject
    ? ElementType['id']
    : never
  : never

type FilteredValue =
  | string
  | number
  | Date
  | string[]
  | number[]
  | IndexedObject[]

/**
 * @typedef {Object} RangeParams
 * @property {string} [range] - The name of the filtered field
 * @property {*} [from]
 * @property {*} [to]
 */
export interface RangeParams<T> {
  range?: keyof T extends FilteredValue ? keyof T | undefined : never
  from?: string | number
  to?: string | number
}

/**
 * @typedef {Object} SortingParams
 * @property {('asc' | 'desc')} [dir] - Sorting direction
 * @property {string} [sort]
 */
export interface SortingParams<T> {
  dir?: SortingDirection
  sort?: keyof T
}

type FilterField<T> = Omit<T, keyof PaginationParams & SortingParams<T>>

/**
 * A dictionary of the collection's field values
 * @typedef {Object} FilterParams
 */
export type FilterParams<T> = {
  [P in keyof FilterField<T>]?: T[P] extends FilteredValue
    ? T[P] extends Date
      // Because filtering by date doesn't make sense
      ? never
      : T[P] extends IndexedObject[]
        ? Array<IndexedObjectValue<T[P]>>
        : T[P] | Array<T[P]>
    : never
}

/**
 * @typedef {Object} ListParams
 */
export type ListParams<T> =
  FilterParams<T> & PaginationParams & RangeParams<T> & SortingParams<T>
