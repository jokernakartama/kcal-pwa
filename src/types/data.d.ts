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
    basis?: Omit<Product, 'id'>
  }

  export interface Recipe {
    id: string
    products: { id: Product['id']; mass: Mass }
  }

  export interface Meal {
    date: string
    recipeId?: Product['id']
    productId?: Recipe['id']
    mass: Mass
  }

  export interface JournalRecord {
    date: string
    meal: Meal[]
  }
}
