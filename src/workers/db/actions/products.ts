import Dexie, { Collection } from 'dexie'
import { DB } from '../../../db'
import { WithOptional } from '../../../types/utils'
import { normalizeString } from '../../../utils/format'
import { getPaginatedResponse, handleSortParams } from '../helpers'
import { ListParams } from '../types'

export const productsActions = {
/**
   * Returns a product by id from the "products" table
   * @param {string} productId
   * @returns {Promise<DataModel.Product | undefined>}
   */
  'GET products/{productId}': async (productId: DataModel.Product['id']) => {
    return await DB.products.get(productId)
  },

  /**
   * Updates or creates a product
   * @param {DataModel.Product} product
   * @returns {Promise<number>}
   */
  'PUT products/{product}': async (
    product: WithOptional<DataModel.Product, 'id'>
  ) => {
    const id = await DB.products
      .put(product as DataModel.Product)
    const result: DataModel.Product = { ...product, id }

    return result
  },

  /**
   * Returns a list of products. Filters items by id and name.
   * @param {ListParams} params
   * @returns {Promise<(DataModel.Product[])>}
   */
  'GET users/{userId}/products': async (
    userId: UserModel.User['id'],
    params?: ListParams<DataModel.Product>
  ) => {
    let collection: Collection<DataModel.Product, number>

    if (params?.sort !== undefined) {
      collection = DB.products
        .orderBy(params.sort)
        .filter(product => product.userId === userId)
    } else {
      collection = DB.products
        .where('userId')
        .equals(userId)
    }

    if (typeof params?.id !== 'undefined') {
      collection = collection
        .filter(product => {
          if (Array.isArray(params.id)){
            return params.id.includes(product.id)
          }
          return params.id === product.id
        })
    }

    if (typeof params?.name === 'string') {
      const filteredName = normalizeString(params.name)

      collection = collection
        .filter(
          product => normalizeString(product.name).includes(filteredName)
        )
    }

    return await getPaginatedResponse(
      handleSortParams(collection, params),
      params
    )
  },

  /**
   * Removes a product
   * @param {number} productId
   * @returns {Promise<(number | undefined)>}
   */
  'DELETE products/{productId}': async (
    productId: DataModel.Product['id']
  ) => {
    try {
      await DB.products
        .delete(productId)

      await DB.recipes
        .where('products.id')
        .equals(productId)
        .modify(recipe => {
          recipe.products = recipe.products.map(product => ({
            ...product,
            isArchived: product.id === productId
          }))
        })

      await DB.meals
        .where({ 'dishes.type': 'product', 'dishes.target.id': productId })
        .modify((value, ref) => {
          ref.value = {
            ...value,
            dishes: value.dishes.map(dish => {
              if (dish.type === 'product' && dish.target.id === productId) {
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
