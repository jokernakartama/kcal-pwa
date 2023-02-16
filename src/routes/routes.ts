import { AppSections } from '../components/layout/AppSections'

export const routes = [
  {
    path: '/',
    component: AppSections,
    children: [
      { path: '/' },
      { path: '/profile', /* ProfileView */ },
      { path: '/goals', /* GoalsView */ },

      { path: '/new-meal', /* component: MealView */ },
      { path: '/new-weal/add-dish', /* component: DishesView */ },
      { path: '/new-meal/add-dish/product/:id', /* component: DishView */ },
      { path: '/new-meal/add-dish/recipe/:id', /* component: DishView */ },
      { path: '/meal/:id', /* component: MealView */ },

      { path: '/new-product', /* component: ProductView */ },
      { path: '/new-recipe', /* component: RecipeView */ },
      { path: '/product/:id', /* component: ProductView */ },
      { path: '/recipe/:id', /* component: RecipeView */ },
    ]
  }
]
