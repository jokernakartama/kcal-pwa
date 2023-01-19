import { SetStoreFunction } from 'solid-js/store'

export interface AppStoreState {
  journal?: DataModel.JournalRecord
  user?: UserModel.User
  goals?: UserModel.Goals
  info?: UserModel.Info
}

export type AppStore = [
  AppStoreState,
  SetStoreFunction<AppStoreState>
]
