import { ListItem } from '../../../types/utils'

export interface EventBusEvent {
  'meal-dish-add': DataModel.Dish
  'meal-dish-change': DataModel.Dish
  'meal-dish-delete': DataModel.Dish
  'recipe-product-add': ListItem<DataModel.Recipe['products']>
  'recipe-product-change': ListItem<DataModel.Recipe['products']>
  'recipe-product-delete': ListItem<DataModel.Recipe['products']>
  'update-products': null
  'update-recipes': null
}
