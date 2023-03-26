declare namespace DataModel {
  export type ID = number
  export type Mass = number

  /**
   * Base type for nutrition
   */
  export interface Nutrition {
    /** Amount of proteins in grams */
    proteins: number
    /**  Amount of fats in grams */
    fats: number
    /**  Amount of carbs in grams  */
    carbs: number
    /**  Energy in kcal */
    energy: number
  }

  /**
   * Nutrition of 100 grams of the product
   */
  export interface Product extends Nutrition {
    id: ID
    /**  Bound user's id */
    userId: UserModel.User['id']
    /**  The name of the product */
    name: string
  }

  /**
   * A set of products with defined mass
   */
  export interface Recipe {
    id: ID
    /**  Bound user's id */
    userId: UserModel.User['id']
    /**  The name of the recipe */
    name: string
    /**  Bound products */
    products: Array<
    Product &
    {
      /** The mass of the product */
      mass: Mass
      /** Whether the product has been removed */
      isArchieved?: boolean
    }
    >
    /** A short description of the recipe */
    description?: string
  }

  export interface BasicDish<T extends (Product | Recipe) = Product | Recipe> {
    /** Dish type either a product or recipe */
    readonly type: 'product' | 'recipe'
    /** Save target entity instance */
    readonly target: Omit<T, 'userId'>
    /** Whether the bound entity has been removed */
    isArchieved?: boolean
  }

  export type Dish<
    T extends (Omit<Product | Recipe, 'userId'>) = Product | Recipe
  > = T extends Omit<Product, 'userId'>
    ? BasicDish<Product> & {
      readonly type: 'product'
      mass: Mass
    }
    : T extends Omit<Recipe, 'userId'>
      ? BasicDish<Recipe> & {
        readonly type: 'recipe'
        /** Portion value for easier calculations  */
        portion: number
      }
      : never

  /**
   * One time meal record.
   */
  export interface Meal {
    id: ID
    /** Bound user's id */
    userId: UserModel.User['id']
    /** Bound journal record */
    recordId: DataModel.JournalRecord['id']
    /** Datetime stamp */
    time: Date
    /** List of bound meal products and/or recipes */
    dishes: Dish[]
  }

  export interface JournalRecord {
    id: ID
    /** Bound user's id */
    userId: UserModel.User['id']
    /** A date in YYYY-MM-DD format */
    date: string
    /** Last saved goals during the day */
    goals: Omit<UserModel.Goals, 'userId'>
  }
}
