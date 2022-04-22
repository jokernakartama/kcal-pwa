import { Collection } from 'dexie'
import { DB } from '../../../db'
import { WithOptional } from '../../../types/utils'
import { normalizeString } from '../../../utils/normalize'
import { getPaginatedResponse, handleSortParams } from '../helpers'
import { ListParams } from '../types'

export const productsActions = {
/**
   * Returns a product by id from the "products" table
   * @param {string} productId
   * @returns {Promise<DataModel.Product | undefined>}
   */
  'GET product/{productId}': (productId: DataModel.Product['id']) => {
    return DB.products.get(productId)
  },

  /**
   * Updates or creates a product
   * @param {DataModel.Product} product
   * @returns {Promise<number>}
   */
  'PUT product/{product}': (product: WithOptional<DataModel.Product, 'id'>) => {
    return DB.products
      .put(product as DataModel.Product)
  },

  /**
   * Returns a list of products
   * @param {ListParams} params
   * @returns {Promise<(DataModel.Product[])>}
   */
  'GET user/{userId}/products': (
    userId: UserModel.Info['id'],
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
          product => normalizeString(product.name).startsWith(filteredName)
        )
    }

    return getPaginatedResponse(
      handleSortParams(collection, params),
      params
    )
  }
}
