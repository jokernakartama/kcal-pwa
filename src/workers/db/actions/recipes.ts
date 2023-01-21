import Dexie, { Collection } from 'dexie'
import { DB } from '../../../db'
import { WithOptional } from '../../../types/utils'
import { normalizeString } from '../../../utils/format'
import { getPaginatedResponse, handleSortParams } from '../helpers'
import { ListParams } from '../types'

export const recipesActions = {
  /**
   * Returns a recipe by id from the "recipes" table
   * @param {string} recipeId
   * @returns {Promise<(DataModel.Recipe | undefined)>}
   */
  'GET recipes/{recipeId}': async (recipeId: DataModel.Recipe['id']) => {
    return await DB.recipes.get(recipeId)
  },

  /**
   * Updates or creates a recipe
   * @param {DataModel.Recipe} recipe
   * @returns {Promise<number>}
   */
  'PUT recipes/{recipe}': async (recipe: WithOptional<DataModel.Recipe, 'id'>) => {
    const id = await DB.recipes
      .put(recipe as DataModel.Recipe)
    const result: DataModel.Recipe = { ...recipe, id }

    return result
  },

  /**
   * Returns a list of recipes. Filters items
   * by id, name and included product ids.
   * @param {number} userId
   * @param {ListParams} params
   * @returns {Promise<DataModel.Recipe[]>}
   */
  'GET users/{userId}/recipes': async (
    userId: UserModel.User['id'],
    params?: ListParams<DataModel.Recipe>
  ) => {
    let collection: Collection<DataModel.Recipe, number>

    if (params?.sort !== undefined) {
      collection = DB.recipes
        .orderBy(params.sort)
        .filter(product => product.userId === userId)
    } else {
      collection = DB.recipes
        .where('userId')
        .equals(userId)
    }

    if (typeof params?.id !== 'undefined') {
      collection = collection
        .filter(recipe => {
          if (Array.isArray(params.id)){
            return params?.id.includes(recipe.id)
          }
          return params.id === recipe.id
        })
    }

    if (params?.products !== undefined) {
      const productIds = params.products
      collection = collection
        .filter(recipe => {
          return recipe.products
            .some(
              product => {
                return productIds.includes(product.id)
              }
            )
        })
    }

    if (typeof params?.name === 'string') {
      const filteredName = normalizeString(params.name)

      collection = collection
        .filter(
          product => normalizeString(product.name).startsWith(filteredName)
        )
    }

    return await getPaginatedResponse(
      handleSortParams(collection, params),
      params
    )
  },

  /**
   * Removes a recipe
   * @param {number} recipeId
   * @returns {Promise<(number | undefined)>}
   */
  'DELETE recipes/{recipeId}': async (
    recipeId: DataModel.Recipe['id']
  ) => {
    try {
      await DB.recipes
        .delete(recipeId)

      await DB.meals
        .where({ 'dish.type': 'recipe', 'dish.target.id': recipeId })
        .modify((value, ref) => {
          ref.value = {
            ...value,
            dishes: value.dishes.map(dish => {
              if (dish.type === 'recipe' && dish.target.id === recipeId) {
                return { ...dish, isArchieved: true }
              }

              return dish
            })
          }
        })
    } catch (e) {
      // Ignore errors of modifying non existed entities
      if (!(e instanceof Dexie.ModifyError)) {
        throw e
      }
    }
  }
}
