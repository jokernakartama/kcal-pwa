import Dexie from 'dexie'

/**
 * Don't forget to change DB version if there were any changes!
 */
export const DB_VER = 1

export const DB_NAME = 'db_test_1'

export const DB_STORES = {
  users: '++id',
  info: 'userId',
  goals: 'userId',
  journal: '++id, [userId+date]',
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
    this.version(DB_VER).stores(DB_STORES)
  }
}

const db = new AppDB()

export const DB = db
