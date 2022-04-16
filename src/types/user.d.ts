declare namespace UserModel {
  export type Activity = 1.2 | 1.375 | 1.46 | 1.55 | 1.64 | 1.72 | 1.9
  export type WeightGoal = -0.15 | 0 | 0.15

  export interface Info {
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
     * Value of the user's weight in kilograms
     */
    weight: number
    /**
     * The user's height in centimeters
     */
    height: number
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
    goal: WeightGoal
  }

  export interface Goals {
    calories: number
    proteins: number
    fats: number
    carbohydrates: number
  }
}
