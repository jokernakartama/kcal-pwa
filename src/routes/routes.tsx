import { RouteDefinition } from '@solidjs/router'
import { AppSections } from '../components/layout/AppSections'
import { GoalsView } from '../components/views/GoalsView'
import { route } from './constants'
import { mealPath } from './paths/meal'
import { productsPath } from './paths/products'
import { recipesPath } from './paths/recipes'

export const routes: RouteDefinition[] = [
  {
    path: '/',
    component: AppSections,
    children: [
      { path: route.HOME },
      { path: route.PROFILE },
      { path: route.GOALS, component: GoalsView },

      mealPath,
      recipesPath,
      productsPath,

      { path: '/*' }
    ]
  }
]
