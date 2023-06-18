import Dexie from 'dexie'

export const DB_NAME = 'ma_poop_data'

class AppDB extends Dexie {
  users!: Dexie.Table<UserModel.User, number>

  info!: Dexie.Table<UserModel.Info, number>

  goals!: Dexie.Table<UserModel.Goals, number>

  journal!: Dexie.Table<DataModel.JournalRecord, number>

  meals!: Dexie.Table<DBExtended.Meal, number>

  recipes!: Dexie.Table<DBExtended.Recipe, number>

  products!: Dexie.Table<DataModel.Product, number>

  constructor() {
    super(DB_NAME)

    this.version(2).stores({
      users: '++id',
      info: 'userId',
      goals: 'userId',
      journal: '++id, [userId+date]',
      meals: '++id, recordId, userId, *_dishesTypes, *_dishesTargetIds',
      recipes: '++id, userId, name, *_productsIds',
      products: '++id, userId, name, proteins, fats, carbs, energy'
    })
      .upgrade (tx => {
        return tx.table<DBExtended.Meal, number>('meals')
          .toCollection().modify(meal => {
            meal._dishesTargetIds = meal.dishes.map(({ target }) => target.id )
            meal._dishesTypes = meal.dishes.map(({ type }) => type)
          })
      })
      .upgrade (tx => {
        return tx.table<DBExtended.Recipe, number>('recipes')
          .toCollection().modify(recipe => {
            recipe._productsIds = recipe.products.map(({ id }) => id )
          })
      })

    this.version(1).stores({
      users: '++id',
      info: 'userId',
      goals: 'userId',
      journal: '++id, [userId+date]',
      meals: '++id, recordId, userId',
      recipes: '++id, userId, name',
      products: '++id, userId, name, proteins, fats, carbs, energy'
    })
  }
}

const db = new AppDB()

export const DB = db
