import { RouteDefinition } from '@solidjs/router'
import { AppSections } from '../components/layout/AppSections'
import { DishesSearchView } from '../components/views/DishesSearchView'
import { DishView } from '../components/views/DishView'
import { GoalsView } from '../components/views/GoalsView'
import { MealView } from '../components/views/MealView'
import { ProductView } from '../components/views/ProductView'
import { route } from './constants'

export const routes: RouteDefinition[] = [
  {
    path: '/',
    component: AppSections,
    children: [
      { path: route.HOME },
      { path: route.GOALS, component: GoalsView },

      { path: route.NEW_MEAL, component: MealView },
      { path: route.DISH_LIST, component: DishesSearchView },
      { path: route.ADD_DISH, component: DishView },
      { path: route.MEAL, component: MealView },

      { path: route.NEW_PRODUCT, component: ProductView },
      { path: route.PRODUCT, component: ProductView },
      { path: '/*' }
    ]
  }
]
