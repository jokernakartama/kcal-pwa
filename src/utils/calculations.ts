export const NutrientEnergy = {
  proteins: 4,
  fats: 9,
  carbs: 4
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
  proteins: 0.3,
  fats: 0.3,
  carbs: 0.4
}

/**
 *
 * @param {number} steps - Average number of daily steps
 * @param {number} gym - Number of minutes of weekly power training
 * @param {number} cardio - Number of minutes of weekly cardio/crossfit
 * @returns {number}
 */
export function getActivity(steps: number, gym: number, cardio: number) {
  return steps * 0.03 + gym * 5 / 7 + cardio
}

/**
 * Calculates BMR.
 * Basal Metabolic Rate is the number of calories
 * required to keep your body functioning at rest.
 * @param {number} weight
 * @param {number} height
 * @param {number} age
 * @param {boolean} isMale
 * @returns {number}
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
 * @returns {number}
 */
export function getEnergy(
  activity: number,
  bmr: number,
  goal = 0
) {
  // Another activity rate
  // return (bmr * activity) * (1 + goal)
  return (bmr * 1.1 + activity) * (1 + goal)
}

/**
 * Calculates the daily value of mass of the nutrient
 * @param {('proteins' | 'fats' | 'carbohydrates')} nutrient
 * @param {number} totalEnergy
 * @param {number} ratio - The proportion of the nutrient
 * in the total volume of food
 * @returns {number}
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
