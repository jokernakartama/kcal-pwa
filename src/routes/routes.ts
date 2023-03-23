import { RouteDefinition } from '@solidjs/router'
import { AppSections } from '../components/layout/AppSections'
import { DishesSearchView } from '../components/views/DishesSearchView'
import { DishView } from '../components/views/DishView'
import { MealView } from '../components/views/MealView'
import { ProductView } from '../components/views/ProductView'
// import { RecipeView } from '../components/views/RecipeView'
import { route } from './constants'

export const routes: RouteDefinition[] = [
  {
    path: '/',
    component: AppSections,
    children: [
      { path: route.HOME },
      { path: route.PROFILE, /* ProfileView */ },
      { path: route.GOALS, /* GoalsView */ },

      { path: route.NEW_MEAL, component: MealView },
      { path: route.DISH_LIST, component: DishesSearchView },
      { path: route.ADD_DISH, component: DishView },
      { path: route.MEAL, component: MealView },

      { path: route.NEW_PRODUCT, component: ProductView },
      { path: route.NEW_RECIPE, /* component: RecipeView */ },
      { path: route.PRODUCT, component: ProductView },
      { path: route.RECIPE, /* component: RecipeView */ },
      { path: '/*' }
    ]
  }
]
