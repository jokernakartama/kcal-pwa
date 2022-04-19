type RangeParam<T> = T extends string | number ? T : never
type FilteredValue = string | number | Date

interface ListRange<T> {
  range?: keyof T extends FilteredValue ? keyof T | undefined: never
  from?: RangeParam<T[keyof T]>
  to?: RangeParam<T[keyof T]>
}

export interface ListPagination {
  limit?: number
  offset?: number
}

export interface ListSorting<T> {
  order?: 'asc' | 'desc'
  sort?: keyof T
}

type FilterField<T> = Omit<T, keyof ListPagination & ListSorting<T>>

type ListFilters<T> = {
  [P in keyof FilterField<T>]?: T[P] extends FilteredValue
    ? T[P] extends Date
      // Because filtering by date doesn't make sense
      ? never
      : T[P] | Array<T[P]>
    : never
}

export type ListParams<T> =
  ListFilters<T> & ListPagination & ListRange<T> & ListSorting<T>
