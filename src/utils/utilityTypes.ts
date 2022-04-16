export type WithOptional<T, K extends keyof T> = Partial<Pick<T, K>> & Omit<T, K>
