import { PaginationResponse, PaginationParams } from '../types/pagination'
import { WithOptional } from '../types/utils'
import { WorkerClient } from '../utils/queryableWorker'
import { dbWorkerActions } from '../workers/db/actions'

const DBWorkerClient = new WorkerClient<typeof dbWorkerActions>(
  new Worker(new URL('../workers/db', import.meta.url))
)

/**
 * Gets user info
 * @param {number} userId
 * @returns {Promise<(UserModel.Info | undefined)>}
 */
export function getUser(
  userId: UserModel.Info['id']
): Promise<UserModel.Info | undefined> {
  return DBWorkerClient
    .dispatch('GET users/{userId}', userId)
}

/**
 * Updates user info
 * @param {UserModel.Info} user
 * @returns {Promise<UserModel.Info>}
 */
export function setUser(
  user: WithOptional<UserModel.Info, 'id'>
): Promise<UserModel.Info> {
  return DBWorkerClient
    .dispatch('PUT users/{user}', user)
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
    .dispatch('GET users/{userId}/goals', userId)
}

/**
 * Updates user's goals
 * @param {UserModel.Goals} goals
 * @returns {Promise<UserModel.Goals>}
 */
export function setUserGoals(
  goals: UserModel.Goals
): Promise<UserModel.Goals> {
  return DBWorkerClient
    .dispatch('PUT goals/{goals}', goals)
}

/**
 * Gets product data by id
 * @param {string} productId
 * @returns {Promise<DataModel.Product>}
 */
export function getProduct(
  productId: DataModel.Product['id']
): Promise<DataModel.Product | undefined> {
  return DBWorkerClient.dispatch('GET products/{productId}', productId)
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
    .dispatch('PUT products/{product}', product)
}

/**
 * Removes the product
 * @param {number} productId
 * @returns {Promise<undefined>}
 */
export function removeProduct(
  productId: DataModel.Product['id']
): Promise<void> {
  return DBWorkerClient
    .dispatch('DELETE products/{productId}', productId)
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
    .dispatch('GET users/{userId}/products', userId, params)
}

/**
 * Gets recipe data by id
 * @param {string} recipeId
 * @returns {Promise<DataModel.Recipe>}
 */
export function getRecipe(
  recipeId: DataModel.Recipe['id']
): Promise<DataModel.Recipe | undefined> {
  return DBWorkerClient.dispatch('GET recipes/{recipeId}', recipeId)
}

/**
 * Updates or creates a recipe
 * @param {DataModel.Recipe} product
 * @returns {Promise<DataModel.Product>}
 */
export function setRecipe(
  recipe: WithOptional<DataModel.Recipe, 'id'>
): Promise<DataModel.Recipe> {
  return DBWorkerClient
    .dispatch('PUT recipes/{recipe}', recipe)
}

/**
 * Removes the recipe
 * @param {string} recipeId
 * @returns {Promise<undefined>}
 */
export function removeRecipe(
  recipeId: DataModel.Recipe['id']
): Promise<void> {
  return DBWorkerClient
    .dispatch('DELETE recipes/{recipeId}', recipeId)
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
    .dispatch('GET users/{userId}/recipes', userId, params)
}

/**
 * Adds a meal. If meal's recordId is not provided also creates a record.
 * @param {DataModel.Meal} meal
 * @returns {Promise<DataModel.Meal>}
 */
export function addMeal(
  meal: WithOptional<DataModel.Meal, 'id' | 'recordId'>
): Promise<DataModel.Meal> {
  return DBWorkerClient
    .dispatch('PUT meals/{meal}', meal)
}

/**
 * Removes the meal
 * @param {number} mealId
 * @returns {Promise<undefined>}
 */
export function removeMeal(
  mealId: DataModel.Meal['id']
): Promise<void> {
  return DBWorkerClient
    .dispatch('DELETE meals/{mealId}', mealId)
}

/**
 * Returns a list of meals of the journal record
 * @param {number} recordId
 * @param {ListParams} params
 * @returns
 */
export function getMeals(
  recordId: DataModel.JournalRecord['id'],
  params?: PaginationParams & {
    dir: 'asc' | 'desc'
  }
): Promise<PaginationResponse<DataModel.Meal>> {
  return DBWorkerClient
    .dispatch('GET journal/{recordId}/meals', recordId, params)
}

/**
 * Returns the user's journal
 * @param {number} userId
 * @param {string} date - A date in format YYYY-MM-DD
 * @returns {Promise<PaginationResponse<DataModel.Journal>>}
 */
export function getJournal(
  userId: UserModel.Info['id'],
  date: string
): Promise<DataModel.JournalRecord | undefined> {
  return DBWorkerClient
    .dispatch('GET users/{userId}/journal', userId, date)
}

/**
 * Removes all journal records and meals of the user
 * @param {number} userId
 * @returns {Promise<undefined>}
 */
export function clearJournal(
  userId: UserModel.Info['id']
): Promise<void> {
  return DBWorkerClient
    .dispatch('DELETE users/{userId}/journal', userId)
}
