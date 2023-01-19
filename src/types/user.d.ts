declare namespace UserModel {

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
  }

  export interface Info {
    userId: User['id']
    /**
     * The user's height in centimeters
     */
    height?: number
    /**
     * Value of the user's weight in kilograms
     */
    weight?: number
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
    activity?: number
    /**
     * Value for the user's weight goal:
     * - -1 - to lose weight
     * - 0 - to keep weight
     * - 1 - to gain weight
     */
    massGainDir?: -1 | 0 | 1
    /**
     * - Normal 0.3 0.3 0.4
     * - To cut 0.4 0.25 0.35 (0.4 0.2-0.25 0.35-0.4)
     * - To bulk 0.3 0.2 0.5 (0.3-0.4 0.2-0.25 0.4-0.5)
     */
    nutrientsRatio?: [number, number, number]

    /**
     * Minutes spent on power training during a week
     */
    gym?: number
    /**
     * Minutes spen on cardio/crossfit during a week
     */
    cardio?: number
    /**
     * Average number of steps during a day
     */
    steps?: number
  }

  export interface Goals {
    userId: User['id']
    /**
     * Value of daily energy in kcal
     */
    energy: number
    proteins: number
    fats: number
    carbs: number
  }
}
