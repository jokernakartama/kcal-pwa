export const NutrientEnergy = {
  proteins: 4,
  fats: 9,
  carbohydrates: 4
}

/**
 * @todo Use ratio as an option:
 * - Normal 0.3 0.3 0.4
 * - To cut 0.4 0.25 0.35 (0.4 0.2-0.25 0.35-0.4)
 * - To bulk 0.3 0.2 0.5 (0.3-0.4 0.2-0.25 0.4-0.5)
 */
export const DEFAULT_NUTRIENTS_RATIO: Record<
  keyof typeof NutrientEnergy, number
> = {
  proteins: 0.35,
  fats: 0.25,
  carbohydrates: 0.4
}

/**
 * Calculates BMR.
 * Basal Metabolic Rate is the number of calories
 * required to keep your body functioning at rest.
 * @param {number} weight
 * @param {number} height
 * @param {number} age
 * @param {boolean} isMale
 * @returns
 */
export function getBasalMetabolicRate(
  weight: number,
  height: number,
  age: number,
  isMale: boolean
): number {
  return (9.99 * weight) + (6.25 * height) - (4.92 * age) + (isMale ? 5 : -161)
}

/**
 * Calculates required daily energy in kcal
 * @param {number} activity - Daily activity rate
 * @param {number} bmr - Basal Metabolic Rate
 * @param {number} goal - Coefficient determing the required deficit or surplus
 * @returns
 */
export function getEnergy(
  activity: UserModel.Activity,
  bmr: number,
  goal: UserModel.WeightGoal = 0
) {
  return activity * bmr * (1 + goal)
}

/**
 * Calculates the daily value of mass of the nutrient
 * @param {('proteins' | 'fats' | 'carbohydrates')} nutrient
 * @param {number} totalEnergy
 * @param {number} ratio - The proportion of the nutrient
 * in the total volume of food
 * @returns
 */
export function getNutrientMassValue(
  nutrient: keyof typeof NutrientEnergy,
  totalEnergy: number,
  ratio?: number,
) {
  const nutrientRatio = ratio ?? DEFAULT_NUTRIENTS_RATIO[nutrient]
  return totalEnergy * nutrientRatio / NutrientEnergy[nutrient]
}

/**
 * Calculates nutrient amount (in grams or kcal)
 * @param {number} nutrientAmount - Nutrient amount in 100g
 * @param {number} productMass - Mass of the product
 * @returns {number}
 */
export function getNutrientAmount(nutrientAmount: number, productMass: number) {
  return nutrientAmount * productMass / 100
}
