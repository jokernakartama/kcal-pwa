import { Collection } from 'dexie'
import { DB } from '../../../db'
import { WithOptional } from '../../../types/utils'
import { normalizeString } from '../../../utils/normalize'
import { getPaginatedResponse, handleSortParams } from '../helpers'
import { ListParams } from '../types'

export const recipesActions = {
  /**
   * Returns a recipe by id from the "recipes" table
   * @param {string} recipeId
   * @returns {Promise<DataModel.Recipe | undefined>}
   */
  'GET recipe/{recipeId}': (recipeId: DataModel.Recipe['id']) => {
    return DB.recipes.get(recipeId)
  },

  /**
   * Updates or creates a recipe
   * @param {DataModel.Recipe} recipe
   * @returns {Promise<number>}
   */
  'PUT recipe/{recipe}': (recipe: WithOptional<DataModel.Recipe, 'id'>) => {
    return DB.recipes
      .put(recipe as DataModel.Recipe)
  },

  /**
   * Returns a list of recipes
   * @param {ListParams} params
   * @returns {Promise<(DataModel.Recipe[])>}
   */
  'GET user/{userId}/recipes': (
    userId: UserModel.Info['id'],
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
        .and(recipe => {
          if (Array.isArray(params.id)){
            return params?.id.includes(recipe.id)
          }
          return params.id === recipe.id
        })
    }

    if (params?.products !== undefined) {
      const productIds = params.products
      collection = collection
        .and(recipe => {
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

      collection = collection.and(
        product => normalizeString(product.name).startsWith(filteredName)
      )
    }

    return getPaginatedResponse(
      handleSortParams(collection, params),
      params
    )
  }
}
