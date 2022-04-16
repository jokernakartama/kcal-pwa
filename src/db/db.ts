import Dexie from 'dexie'

/**
 * Don't forget to change DB version if there were any changes!
 */
export const DB_VER = 2

export const DB_NAME = 'db_test_1'

export const DB_STORES = {
  users: '++id',
  goals: 'userId',
  journal: '&id,userId,date',
  meals: 'dayId',
  recipes: '&id,userId,name,*productId',
  products: '&id,userId,name,proteins,fats,carbohydrates,kcalories'
}

class AppDB extends Dexie {
  users!: Dexie.Table<UserModel.Info, number>

  goals!: Dexie.Table<UserModel.Goals, number>

  journal!: Dexie.Table<DataModel.JournalRecord, string>

  meals!: Dexie.Table<DataModel.Meal, string>

  recipes!: Dexie.Table<DataModel.Recipe, string>

  products!: Dexie.Table<DataModel.Product, string>

  constructor() {
    super(DB_NAME)
    this.version(DB_VER).stores(DB_STORES)
  }
}

const db = new AppDB()

export const DB = db
