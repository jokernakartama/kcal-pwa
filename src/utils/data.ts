import { WithOptional } from '../types/utils'
import { getNutrientAmount } from './calculations'

/**
 * Checks if target is a recipe
 * @param {(DataModel.Product | DataModel.Recipe)} dish
 * @returns {boolean}
 */
export function isRecipe(
  dish: WithOptional<DataModel.Product | DataModel.Recipe, 'userId'>
): dish is DataModel.Recipe {
  return !!(dish as DataModel.Recipe).products
}

/**
 * Creates a recipe-based dish object
 * @param {DataModel.Recipe} recipe
 * @param {number} portion
 * @returns {DataModel.Dish<DataModel.BasicRecipe>}
 */
export function getDishFromRecipe(
  recipe: DataModel.BasicRecipe,
  portion: number
): DataModel.Dish<DataModel.BasicRecipe> {
  return {
    type: 'recipe' as const,
    target: recipe,
    portion
  }
}

/**
 * Creates a product-based dish object
 * @param {DataModel.Product} product
 * @param {number} mass
 * @returns {DataModel.Dish<DataModel.BasicProduct>}
 */
export function getDishFromProduct(
  product: DataModel.BasicProduct,
  mass: number
): DataModel.Dish<DataModel.BasicProduct> {
  return {
    type: 'product' as const,
    target:product,
    mass
  }

}

/**
 * Creates a dish record from anything
 * @param {(DataModel.Product | DataModel.Recipe)} target
 * @param {number} amount
 * @returns {DataModel.Dish}
 */
export function getDishFromAnything(
  target: DataModel.Dish['target'],
  amount: number
): DataModel.Dish {
  if (isRecipe(target)) {
    return getDishFromRecipe(target, amount)
  }

  return getDishFromProduct(target as DataModel.BasicProduct, amount)
}

/**
 * Whether the dish is a product
 * @param {DataModel.Dish} dish
 * @returns {boolean}
 */
export function isDishProduct(
  dish: DataModel.Dish
): dish is DataModel.Dish<DataModel.Product>{
  if (dish.type === 'product') {
    return true
  }

  return false
}

/**
 * Whether the dish is a recipe
 * @param {DataModel.Dish} dish
 * @returns {boolean}
 */
export function isDishRecipe(
  dish: DataModel.Dish
): dish is DataModel.Dish<DataModel.Recipe>{
  if (dish.type === 'recipe') {
    return true
  }

  return false
}

/**
 * Calculates nutrition of a product
 * @param {DataModel.Product} product
 * @param {DataModel.Mass} mass
 * @returns {Object} Nutrition values
 */
export function calculateProductNutrition(
  product: WithOptional<DataModel.Product, 'userId' | 'id'>,
  mass: DataModel.Mass
): DataModel.Nutrition {
  const result: DataModel.Nutrition = {
    energy: 0,
    proteins: 0,
    fats: 0,
    carbs: 0
  }

  ;(Object.keys(result) as Array<keyof typeof result>)
    .forEach(key => {
      result[key] += getNutrientAmount(product[key], mass)
    })

  return result
}

/**
 * Calculates nutrition of a recipe
 * @param {DataModel.Recipe} recipe
 * @param {number} [portion=1]
 * @returns
 */
export function calculateRecipeNutrition(
  recipe: WithOptional<DataModel.Recipe, 'userId' | 'id'>,
  portion = 1
): DataModel.Nutrition {
  const result: DataModel.Nutrition = {
    energy: 0,
    proteins: 0,
    fats: 0,
    carbs: 0
  }

  recipe.products.forEach(product => {
    const productNutrition = calculateProductNutrition(product, product.mass)

    result.energy += productNutrition.energy * portion
    result.proteins += productNutrition.proteins * portion
    result.fats += productNutrition.fats * portion
    result.carbs += productNutrition.carbs * portion
  })

  return result
}

/**
 * Calculates nutrition of a meal
 * @param {DataModel.Meal} meal
 * @returns {Object} Nutrition of the meal
 */
export function calculateMealNutrition(
  meal: DataModel.Meal
): DataModel.Nutrition {
  const result: DataModel.Nutrition = {
    energy: 0,
    proteins: 0,
    fats: 0,
    carbs: 0
  }

  meal.dishes.forEach(dish => {
    if (isDishRecipe(dish)) {
      const recipeNutrition = calculateRecipeNutrition(dish.target)

      result.energy += recipeNutrition.energy
      result.proteins += recipeNutrition.proteins
      result.fats += recipeNutrition.fats
      result.carbs += recipeNutrition.carbs

    } else if (isDishProduct(dish)) {
      const productNutrition = calculateProductNutrition(dish.target, dish.mass)

      result.energy += productNutrition.energy
      result.proteins += productNutrition.proteins
      result.fats += productNutrition.fats
      result.carbs += productNutrition.carbs
    }
  })

  return result
}

/**
 * Unproxifies the dish
 * @param {DataModel.Dish} dish
 * @returns {DataModel.Dish}
 */
export function cloneDish(dish: DataModel.Dish): DataModel.Dish {
  if (dish.type === 'recipe') {
    return ({
      ...dish,
      target: {
        ...dish.target,
        products: dish.target.products.map(product => ({ ...product }))
      }
    })
  }

  return ({ ...dish, target: { ...dish.target } })
}
