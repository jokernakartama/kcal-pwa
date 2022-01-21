import { DeepReadonly, SetStoreFunction } from 'solid-js/store'

export interface AppStoreState {
  journal: DataModel.JournalRecord[]
  user?: {
    name: string
    sex: 'male' | 'female'
    birthDate: string
    weight: number
    height: number
    activity: number
    goal: number
  }
}

export type AppStore = [
  DeepReadonly<AppStoreState>,
  SetStoreFunction<AppStoreState>
]
