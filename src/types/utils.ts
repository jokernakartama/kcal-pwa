import { Collection, IndexableType } from 'dexie'

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
