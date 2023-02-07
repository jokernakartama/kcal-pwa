import { getNutrientAmount } from './calculations'

/**
 * Whether the dish is a product
 * @param {DataModel.Dish} dish
 * @returns {boolean}
 */
export function isProduct(
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
export function isRecipe(
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
  product: DataModel.Nutrition,
  mass: DataModel.Mass
): Record<
  keyof DataModel.Nutrition,
  number
  > {
  const result: Record<
  keyof DataModel.Nutrition, number
  > & { energy: number } = {
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
 * Calculates nutrition of a meal
 * @param {DataModel.Meal} meal
 * @returns {Object} Nutrition of the meal
 */
export function calculateMealNutrition(meal: DataModel.Meal): Record<
keyof DataModel.Nutrition,
number
> {
  const result: Record<
  keyof DataModel.Nutrition, number
  > & { energy: number } = {
    energy: 0,
    proteins: 0,
    fats: 0,
    carbs: 0
  }

  meal.dishes.forEach(dish => {
    if (isRecipe(dish)) {
      dish.target.products.forEach(product => {
        const productNutrition = calculateProductNutrition(product, product.mass)

        result.energy += productNutrition.energy
        result.proteins += productNutrition.proteins
        result.fats += productNutrition.fats
        result.carbs += productNutrition.carbs
      })
    } else if (isProduct(dish)) {
      const productNutrition = calculateProductNutrition(dish.target, dish.mass)

      result.energy += productNutrition.energy
      result.proteins += productNutrition.proteins
      result.fats += productNutrition.fats
      result.carbs += productNutrition.carbs
    }
  })

  return result
}
