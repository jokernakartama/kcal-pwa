import { Collection, IndexableType } from 'dexie'
import { PaginationResponse } from './pagination'

/**
 * Makes some fields optional
 * @typedef {Object} WithOptional
 */
export type WithOptional<T, K extends keyof T> = Partial<Pick<T, K>> & Omit<T, K>

/**
 * Extracts the data type of the collection
 * @typedef {*} ExtractCollectionDataType
 */
export type ExtractCollectionDataType<C> =
  C extends Collection<infer T, IndexableType>
    ? T
    : never

export type ExtractPaginationDataType<R> =
  R extends PaginationResponse<infer T>
    ? T
    : unknown

export type ListItem<A extends unknown[]> = A extends Array<infer T> ? T : never

export type Indexed<T extends object> = {
  [K in keyof T]: T[K]
}

export type QueryParams<T extends object> = {
  [K in keyof T]: string
}
