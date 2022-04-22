import { PaginationResponse, PaginationParams } from '../types/pagination'
import { WithOptional } from '../types/utils'
import { WorkerClient } from '../utils/queryableWorker'
import { dbWorkerActions } from '../workers/db/actions'

const DBWorkerClient = new WorkerClient<typeof dbWorkerActions>(
  new Worker(new URL('../workers/db', import.meta.url))
)

/**
 * Creates a new user
 * @param {UserModel.Info} fields - User info (without id)
 * @returns {Promise<UserModel.Info>}
 */
export function createUser(
  fields: Omit<UserModel.Info, 'id'>
): Promise<UserModel.Info>{
  return DBWorkerClient
    .dispatch('PUT user/{user}', fields)
    .then(id => {
      return { ...fields, id }
    })
}

/**
 * Updates user info
 * @param {UserModel.Info} user
 * @returns {Promise<UserModel.Info>}
 */
export function setUser(user: UserModel.Info): Promise<UserModel.Info> {
  return DBWorkerClient
    .dispatch('PUT user/{user}', user)
    .then(() => user)
}

/**
 * Gets user info
 * @param {number} userId
 * @returns {Promise<UserModel.Info | undefined>}
 */
export function getUser(
  userId: UserModel.Info['id']
): Promise<UserModel.Info | undefined> {
  return DBWorkerClient
    .dispatch('GET user/{userId}', userId)
}

/**
 * Returns a list of users
 * @returns {Promise<UserModel.Info[]>}
 */
export function getUsers(): Promise<UserModel.Info[]> {
  return DBWorkerClient
    .dispatch('GET users')
}

/**
 * Returns the user's goals fo nutrition
 * @param {number} userId
 * @returns {Promise<UserModel.Goals | undefined>>}
 */
export function getUserGoals(
  userId: UserModel.Info['id']
): Promise<UserModel.Goals | undefined> {
  return DBWorkerClient
    .dispatch('GET user/{userId}/goals', userId)
}

/**
 * Updates user's goals
 * @param {UserModel.Goals} goals
 * @returns {Promise<UserModel.Goals>}
 */
export function setUserGoals(
  goals: UserModel.Goals
) {
  return DBWorkerClient
    .dispatch('PUT goals/{goals}', goals)
    .then(() => goals)
}

/**
 * Gets product data by id
 * @param {string} productId
 * @returns {Promise<DataModel.Product>}
 */
export function getProduct(
  productId: DataModel.Product['id']
): Promise<DataModel.Product | undefined> {
  return DBWorkerClient.dispatch('GET product/{productId}', productId)
}

/**
 * Updates or creates a product
 * @param {DataModel.Product} product
 * @returns {Promise<DataModel.Product>}
 */
export function setProduct(
  product: WithOptional<DataModel.Product, 'id'>
): Promise<DataModel.Product> {
  return DBWorkerClient
    .dispatch('PUT product/{product}', product)
    .then(id => {
      return { ...product, id }
    })
}

/**
 * Returns the user's products
 * @param {number} userId
 * @param {ListParams} params
 * @returns {Promise<PaginationResponse<DataModel.Product>>}
 */
export function getProducts(
  userId: UserModel.Info['id'],
  params?: PaginationParams & {
    id?: number | number[]
    name?: string,
    sort?: 'name' | 'kcalories' | 'id'
    dir?: 'asc' | 'desc'
  }
): Promise<PaginationResponse<DataModel.Product>> {
  return DBWorkerClient
    .dispatch('GET user/{userId}/products', userId, params)
}

/**
 * Gets recipe data by id
 * @param {string} productId
 * @returns {Promise<DataModel.Product>}
 */
export function getRecipe(
  recipeId: DataModel.Recipe['id']
): Promise<DataModel.Recipe | undefined> {
  return DBWorkerClient.dispatch('GET recipe/{recipeId}', recipeId)
}

/**
 * Updates or creates a recipe
 * @param {DataModel.Product} product
 * @returns {Promise<DataModel.Product>}
 */
export function setRecipe(
  recipe: WithOptional<DataModel.Recipe, 'id'>
): Promise<DataModel.Recipe> {
  return DBWorkerClient
    .dispatch('PUT recipe/{recipe}', recipe)
    .then(id => {
      return { ...recipe, id }
    })
}

/**
 * Returns the user's recipes
 * @param {number} userId
 * @param {ListParams} params
 * @returns {Promise<PaginationResponse<DataModel.Recipe>>}
 */
export function getRecipes(
  userId: UserModel.Info['id'],
  params?: PaginationParams & {
    id?: number | number[]
    name?: string,
    products?: number[]
    sort?: 'name' | 'id'
    dir?: 'asc' | 'desc'
  }
): Promise<PaginationResponse<DataModel.Recipe>> {
  return DBWorkerClient
    .dispatch('GET user/{userId}/recipes', userId, params)
}

/**
 * Updates or creates a journal record
 * @param {DataModel.Product} product
 * @returns {Promise<DataModel.JournalRecord>}
 */
export function setJournalRecord(
  record: WithOptional<DataModel.JournalRecord, 'id'>
): Promise<DataModel.JournalRecord> {
  return DBWorkerClient
    .dispatch('PUT journal/{record}', record)
    .then(id => {
      return { ...record, id }
    })
}

/**
 * Returns the user's journal
 * @param {number} userId
 * @param {ListParams} params
 * @returns {Promise<PaginationResponse<DataModel.Journal>>}
 */
export function getUserJournal(
  userId: UserModel.Info['id'],
  params?: PaginationParams & {
    from?: string
    to?: string
    sort?: 'id' | 'date'
    dir?: 'asc' | 'desc'
  }
): Promise<PaginationResponse<DataModel.JournalRecord>> {
  return DBWorkerClient.dispatch('GET user/{userId}/journal', userId, params)
}
