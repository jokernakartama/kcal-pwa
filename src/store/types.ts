import { SetStoreFunction } from 'solid-js/store'

export interface AppStoreState {
  journal?: DataModel.JournalRecord
  meals: DataModel.Meal[]
  user?: UserModel.User
  goals?: UserModel.Goals
  info?: UserModel.Info
  /**
   * List of dishes for a new meal
   */
  dishes: DataModel.Dish[]
}

export type AppStore = [
  AppStoreState,
  SetStoreFunction<AppStoreState>
]
