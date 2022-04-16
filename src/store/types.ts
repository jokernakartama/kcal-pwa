import { DeepReadonly, SetStoreFunction } from 'solid-js/store'

export interface AppStoreState {
  journal: DataModel.JournalRecord[]
  user?: UserModel.Info
  goals?: UserModel.Goals
}

export type AppStore = [
  DeepReadonly<AppStoreState>,
  SetStoreFunction<AppStoreState>
]
