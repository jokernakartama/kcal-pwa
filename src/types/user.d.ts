declare namespace UserModel {
  export type Activity = 1.2 | 1.375 | 1.46 | 1.55 | 1.64 | 1.72 | 1.9
  export type WeightGoal = -0.15 | 0 | 0.15
  export type NutritionType = 'normal' | 'cut' | 'bulk' | 'custom'

  export interface Info {
    id: number
    name: string
    sex: 'male' | 'female'
    birthDate: string
    weight: number
    height: number
    activity: Activity
    goal: WeightGoal
  }

  export interface Goals {
    userId: Info['id']
    kcalories: number
    proteins: number
    fats: number
    carbohydrates: number
  }

  export interface User {
    id: number
    /**
     * The user's name
     */
    name: string
    /**
     * The user's sex
     */
    sex: 'male' | 'female'
    /**
     * The date of the user's birthday
     */
    birthDate: string
    /**
     * The user's height in centimeters
     */
    height: number
    /**
     * Value of the user's weight in kilograms
     */
    weight: number
    /**
     * Value of the user's activity:
     * - 1.2 – minimal activity (lack of physical activity, sedentary work)
     * - 1.375 – little activity (light workout or walking, little daily activity during the day)
     * - 1.46 – average activity (workout 4-5 times a week, good activity during the day)
     * - 1.55 – above average activity (intense workout 5-6 times a week, good activity during the day)
     * - 1.64 – increased activity (daily workout, high daily activity)
     * - 1.72 – high activity (daily very intense training and high daily activity)
     * - 1.9 – very high activity (sportsmen in a period of preparations for a competition)
     */
    activity: Activity
    /**
     * Value for the user's weight goal:
     * - -0.15 - to lose weight
     * - 0 - to keep weight
     * - 0.15 - to gain weight
     */
    massGainDir: -1 | 0 | 1
    /**
     * - Normal 0.3 0.3 0.4
     * - To cut 0.4 0.25 0.35 (0.4 0.2-0.25 0.35-0.4)
     * - To bulk 0.3 0.2 0.5 (0.3-0.4 0.2-0.25 0.4-0.5)
     */
    nutrientsRatio: [number, number, number]
  }
}
