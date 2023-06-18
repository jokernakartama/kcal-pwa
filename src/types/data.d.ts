declare namespace DataModel {
  export type ID = number
  export type Mass = number
  export type DishType = 'product' | 'recipe'
  export type MealLabel = 'breakfast' | 'brunch' | 'lunch' | 'dinner' | 'snack'
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
  export interface BasicProduct extends Nutrition {
    id: ID
    /**  The name of the product */
    name: string
  }

  /**
   * Nutrition of 100 grams of the product
   */
  export interface Product extends BasicProduct {
    userId: UserModel.User['id']
  }

  /**
   * A set of products with defined mass
   */
  export interface BasicRecipe {
    id: ID
    /**  The name of the recipe */
    name: string
    /**  Bound products */
    products: Array<
    BasicProduct &
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
   * A set of products with defined mass
   */
  export interface Recipe extends BasicRecipe {
    /**  Bound user's id */
    userId: UserModel.User['id']
  }

  export interface BasicDish<
    T extends (BasicProduct | BasicRecipe) = BasicProduct | BasicRecipe
  > {
    /** Dish type either a product or recipe */
    readonly type: DishType
    /** Save target entity instance */
    readonly target: Omit<T, 'userId'>
    /** Whether the bound entity has been removed */
    isArchieved?: boolean
  }

  export type Dish<
    T extends (BasicProduct | BasicRecipe) = BasicProduct | BasicRecipe
  > = T extends BasicProduct
    ? BasicDish<BasicProduct> & {
      readonly type: 'product'
      mass: Mass
    }
    : T extends BasicRecipe
      ? BasicDish<BasicRecipe> & {
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
    /** Related meal time */
    label: MealLabel
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

declare namespace DBExtended {
  export interface Meal extends DataModel.Meal {
    _dishesTypes: DataModel.DishType[]
    _dishesTargetIds: DataModel.ID[]
  }
  export interface Recipe extends DataModel.Recipe {
    _productsIds: DataModel.ID[]
  }
}
