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
    userId: UserModel.Info['id']
    id: number
    name: string
  }

  export interface Recipe {
    userId: UserModel.Info['id']
    id: number
    name: string
    products: Array<{ id: Product['id']; mass: Mass }>
    description?: string
  }

  export interface Meal {
    dayId: DataModel.JournalRecord['id']
    date: string
    recipeId?: Product['id']
    productId?: Recipe['id']
    mass: Mass
  }

  export interface JournalRecord {
    userId: UserModel.Info['id']
    id: number
    date: Date
    meal: Meal[]
  }
}
