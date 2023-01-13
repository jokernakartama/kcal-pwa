declare namespace DataModel {
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
    id: number
    /**  Bound user's id */
    userId: UserModel.User['id']
    /**  The name of the product */
    name: string
  }

  /**
   * A set of products with defined mass
   */
  export interface Recipe {
    id: number
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

  /**
   * One time meal record. It can contains either product or recipe.
   */
  export interface Meal {
    id: number
    /** Bound user's id */
    userId: UserModel.User['id']
    /** Bound journal record */
    recordId: DataModel.JournalRecord['id']
    /** Datetime stamp */
    time: Date
    /** Bound recipe object */
    recipe?: Recipe
    /** Bound product object */
    product?: Product
    /** Whether the bound entity has been removed */
    isArchieved?: boolean
    /**
     * Resulting mass of the product or meal by recipe. If it's a recipe,
     * calculated mass of the meal should be used by default.
     */
    mass: Mass
  }

  export interface JournalRecord {
    id: number
    /** Bound user's id */
    userId: UserModel.User['id']
    /** A date in YYYY-MM-DD format */
    date: string
  }
}
