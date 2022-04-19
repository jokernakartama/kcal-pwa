import { DB } from '../../../db'
import { WithOptional } from '../../../utils/utilityTypes'

export const recipesActions = {
  /**
   * Returns a recipe by id from the "recipes" table
   * @param {string} id
   * @returns {Promise<DataModel.Recipe | undefined>}
   */
  'GET recipe/{id}': (id: DataModel.Recipe['id']) => {
    return DB.recipes.get(id)
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

  // filters:
  // by id from meal (multiple)
  // by name
  // by product id

  // sortBy: name
  'GET recipes': () => {
    return []
  },
}
