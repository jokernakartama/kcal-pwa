export const route = {
  /**
   * Main app view
   */
  HOME: '/',
  /**
   * Profile related information
   */
  PROFILE: '/profile',
  /**
   * Goals settings
   */
  GOALS: '/goals',
  /**
   * Collecting dishes for a new meal and adding the meal
   */
  NEW_MEAL: '/new-meal',
  /**
   * Looking for a product/recipe and adding it to a new meal
   */
  ADD_DISH: '/new-meal/add-dish',
  /**
   * Setting up mass for a particular product to add it to a new meal
   */
  ADD_PRODUCT: '/new-meal/add-dish/product/:id',
  /**
   * Setting up portion size for a particular recipe to add it to a new meal
   */
  ADD_RECIPE: '/new-meal/add-dish/recipe/:id',
  /**
   * Displaying the list of dishes of a meal
   */
  MEAL: '/meal/:id',
  /**
   * Adding a new product
   */
  NEW_PRODUCT: '/new-product',
  /**
   * Adding a new recipe
   */
  NEW_RECIPE: '/new-recipe',
  /**
   * View an existing product
   */
  PRODUCT: '/product/:id',
  /**
   * View an existing recipe
   */
  RECIPE: '/recipe/:id',
}
