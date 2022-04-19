declare namespace DataModel {
  export type Mass = number

  export interface Nutrition {
    proteins: number
    fats: number
    carbohydrates: number
    kcalories: number
    // micro elements
  }

  export interface Product extends Nutrition {
    id: string
    name: string
  }

  export interface Recipe {
    id: string
    name: string
    products: Array<{ id: Product['id']; mass: Mass }>
    description?: string
  }

  export interface Meal {
    date: string
    recipeId?: Product['id']
    productId?: Recipe['id']
    mass: Mass
  }

  export interface JournalRecord {
    id: string
    date: Date
    meal: Meal[]
  }
}
