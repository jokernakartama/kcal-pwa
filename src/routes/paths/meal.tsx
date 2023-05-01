import { RouteDefinition } from '@solidjs/router'
import { DishesSearchView, DishesSearchViewNavigation } from '../../components/views/DishesSearchView'
import { DishView, DishViewNavigation } from '../../components/views/DishView'
import { MealView, MealViewNavigation } from '../../components/views/MealView'
import { ProductView, ProductViewNavigation } from '../../components/views/ProductView'
import { RecipeView, RecipeViewNavigation } from '../../components/views/RecipeView'
import { createNavigator } from '../../hooks/createNavigator'
import { injectParams, substractSegments } from '../../utils/routing'
import { endpoint, route } from '../constants'

/**
 * Set of paths to view/edit an existing meal
 */
export const mealPath: RouteDefinition = {
  path: [route.MEAL, route.NEW_MEAL],
  component: MealView,
  data: (): MealViewNavigation => {
    const navigate = createNavigator()
    const toMain = () => navigate(endpoint.HOME, -1)
    const navigation: MealViewNavigation = {
      quit: toMain, back: toMain,
      toDish: (id, type, amount) => navigate(
        injectParams(route.DISH, { id, type }),
        { resolve: true, query: { amount } }
      ),
      toDishes: () => navigate(route.DISHES, { resolve: true })
    }

    return navigation
  },
  children: [
    { path: '/' },

    /** Change mass/portion of the already added dish */
    {
      path: route.DISH,
      component: () => <DishView target="meal" action="change" />,
      data: ({ location: { pathname }, params }): DishViewNavigation => {
        const navigate = createNavigator()
        const navigation: DishViewNavigation = {
          back: () => navigate(
            substractSegments(
              pathname,
              injectParams(route.DISH, params)
            ), -1
          ),
          quit: () => navigate(endpoint.HOME, -2),
          toTarget: () => navigate(
            substractSegments(
              pathname,
              injectParams(route.DISH, params)
            ),
            -1
          )
        }
        return navigation
      }
    },
    /** Display products and recipes to add to the dish */
    {
      path: route.DISHES,
      component: DishesSearchView,
      data: ({ location: { pathname } }): DishesSearchViewNavigation => {
        const navigate = createNavigator()
        const navigation: DishesSearchViewNavigation = {
          quit: () => navigate(endpoint.HOME, -2),
          back: () => navigate(
            substractSegments(pathname, route.DISHES), -1
          ),
          toCreate: (type) => navigate(
            type === 'recipe' ? route.NEW_RECIPE : route.NEW_PRODUCT,
            { resolve: true }
          ),
          toDish: (id, type) => navigate(
            injectParams(route.DISH, { id, type }), { resolve: true }
          )
        }

        return navigation
      },

      children: [
        { path: '/' },

        /** Change mass/portion of the adding dish */
        {
          path: route.DISH,
          component: () => <DishView target="meal" action="add" />,
          data: ({ location: { pathname }, params }): DishViewNavigation => {
            const navigate = createNavigator()
            const navigation: DishViewNavigation = {
              back: () => navigate(
                substractSegments(
                  pathname,
                  injectParams(route.DISH, params)
                ), -1
              ),
              quit: () => navigate(endpoint.HOME, -3),
              toTarget: () => navigate(
                substractSegments(
                  pathname,
                  injectParams(route.DISH, params),
                  route.DISHES
                ),
                -2
              )
            }
            return navigation
          }
        },
        /** Add a new product to the meal */
        {
          path: route.NEW_PRODUCT,
          component: () => <ProductView withTarget />,
          data: ({ location: { pathname } }): ProductViewNavigation => {
            const navigate = createNavigator()
            const navigation: ProductViewNavigation = {
              back: () => navigate(
                substractSegments(pathname, route.NEW_PRODUCT), -1
              ),
              quit: () => navigate(endpoint.HOME, -3),
              toTarget: (id) => {
                const pathToProduct = [
                  substractSegments(pathname, route.NEW_PRODUCT),
                  injectParams(route.DISH, { id, type: 'product' })
                ].join('/')
                navigate(pathToProduct, { replace: true })
              }
            }

            return navigation
          }
        },
        /** Add a new recipe to the meal */
        {
          path: route.NEW_RECIPE,
          component: () => <RecipeView withTarget />,
          data: ({ location: { pathname } }): RecipeViewNavigation => {
            const navigate = createNavigator()
            const navigation: RecipeViewNavigation = {
              back: () => navigate(
                substractSegments(pathname, route.NEW_RECIPE), -1
              ),
              quit: () => navigate(endpoint.HOME, -3),
              toProducts: () => navigate(route.PRODUCTS, { resolve: true }),
              toProduct: (id: DataModel.Product['id']) => {
                navigate(
                  injectParams(route.DISH, { id, type: 'product' }),
                  { resolve: true }
                )
              },
              toTarget: (id) => {
                const pathToRecipe = [
                  substractSegments(pathname, route.NEW_RECIPE),
                  injectParams(route.DISH, { id, type: 'recipe' })
                ].join('/')
                navigate(pathToRecipe, { replace: true })
              }
            }

            return navigation
          },
          children: [
            { path: '/' },

            {
              path: route.DISH,
              component: () => <DishView target="recipe" action="change" />,
              data: ({ location: { pathname }, params }): DishViewNavigation => {
                const navigate = createNavigator()
                const navigation: DishViewNavigation = {
                  back: () => navigate(
                    substractSegments(
                      pathname,
                      injectParams(route.DISH, params)
                    ), -1
                  ),
                  quit: () => navigate(endpoint.HOME, -4),
                  toTarget: () => navigate(
                    substractSegments(
                      pathname,
                      injectParams(route.DISH, params)
                    ),
                    -1
                  )
                }
                return navigation
              }
            },

            /** List of prouducts */
            {
              path: route.PRODUCTS,
              component: () => <DishesSearchView only="product" />,
              data: ({ location: { pathname } }): DishesSearchViewNavigation => {
                const navigate = createNavigator()
                const navigation: DishesSearchViewNavigation = {
                  quit: () => navigate(endpoint.HOME, -4),
                  back: () => navigate(
                    substractSegments(pathname, route.PRODUCTS), -1
                  ),
                  toCreate: () => navigate(
                    route.NEW_PRODUCT,
                    { resolve: true }
                  ),
                  toDish: (id) => navigate(
                    injectParams(route.DISH, { id, type: 'product' }),
                    { resolve: true }
                  )
                }

                return navigation
              },
              children: [
                { path: '/' },

                {
                  path: route.DISH,
                  component: () => <DishView target="recipe" action="add" />,
                  data: ({ location: { pathname }, params }): DishViewNavigation => {
                    const navigate = createNavigator()
                    const navigation: DishViewNavigation = {
                      back: () => navigate(
                        substractSegments(
                          pathname,
                          injectParams(route.DISH, params)
                        ), -1
                      ),
                      quit: () => navigate(endpoint.HOME, -5),
                      toTarget: () => navigate(
                        substractSegments(
                          pathname,
                          injectParams(route.DISH, params),
                          route.PRODUCTS
                        ),
                        -2
                      )
                    }
                    return navigation
                  }
                },
                {
                  path: route.NEW_PRODUCT,
                  component: () => <ProductView withTarget />,
                  data: ({ location: { pathname } }): ProductViewNavigation => {
                    const navigate = createNavigator()
                    const navigation: ProductViewNavigation = {
                      back: () => navigate(
                        substractSegments(pathname, route.NEW_PRODUCT), -1
                      ),
                      quit: () => navigate(endpoint.HOME, -5),
                      toTarget: (id) => {
                        const pathToProduct = [
                          substractSegments(pathname, route.NEW_PRODUCT),
                          injectParams(route.DISH, { id, type: 'product' })
                        ].join('/')
                        navigate(pathToProduct, { replace: true })
                      }
                    }

                    return navigation
                  }
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
