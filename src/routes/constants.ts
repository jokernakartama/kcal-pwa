export const route = {
  HOME: '',
  PROFILE: 'profile',
  GOALS: 'goals',
  MEAL: 'meal/:mid',
  NEW_MEAL: 'new-meal',
  DISHES: 'dishes',
  DISH: ':type/:id',
  PRODUCTS: 'products',
  PRODUCT: 'product/:pid',
  NEW_PRODUCT: 'new-product',
  RECIPES: 'recipes',
  RECIPE: 'recipe/:rid',
  NEW_RECIPE: 'new-recipe',
}

export const endpoint = {
  HOME: ['', route.HOME].join('/'),
  PROFILE: [route.HOME, route.PROFILE].join('/'),
  GOALS: [route.HOME, route.GOALS].join('/'),
  MEAL: [route.HOME, route.MEAL].join('/'),
  NEW_MEAL: [route.HOME, route.NEW_MEAL].join('/')
}
