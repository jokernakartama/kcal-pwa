import Dexie from 'dexie'

export const DB_NAME = 'ma_poop_data'

export const DB_STORES = {
  users: '++id',
  info: 'userId',
  goals: 'userId',
  journal: '++id, [userId+date]',
  // Unfortunately, seems like there is no way
  // to use multy-entry compound index, like "*[dishes.type+dihes.target.id]"
  meals: '++id, recordId, userId, *dishes.type, *dishes.target.id',
  recipes: '++id, userId, name, *products.id',
  products: '++id, userId, name, proteins, fats, carbs, energy'
}

class AppDB extends Dexie {
  users!: Dexie.Table<UserModel.User, number>

  info!: Dexie.Table<UserModel.Info, number>

  goals!: Dexie.Table<UserModel.Goals, number>

  journal!: Dexie.Table<DataModel.JournalRecord, number>

  meals!: Dexie.Table<DataModel.Meal, number>

  recipes!: Dexie.Table<DataModel.Recipe, number>

  products!: Dexie.Table<DataModel.Product, number>

  constructor() {
    super(DB_NAME)
    this.version(1).stores(DB_STORES)
  }
}

const db = new AppDB()

export const DB = db
