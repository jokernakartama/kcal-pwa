import { RouteDefinition } from '@solidjs/router'
import { useEventBus } from '../../components/providers/EventBus'
import { DishesSearchView, DishesSearchViewNavigation } from '../../components/views/DishesSearchView'
import { DishView, DishViewNavigation } from '../../components/views/DishView'
import { ProductView, ProductViewNavigation } from '../../components/views/ProductView'
import { RecipeView, RecipeViewNavigation } from '../../components/views/RecipeView'
import { createNavigator } from '../../hooks/createNavigator'
import { injectParams, substractSegments } from '../../utils/routing'
import { endpoint, route } from '../constants'

/**
 * Set of paths to manage recipes
 */
export const recipesPath: RouteDefinition = {
  path: route.RECIPES,
  component: () => <DishesSearchView only="recipe" />,
  data: (): DishesSearchViewNavigation => {
    const navigate = createNavigator()
    const toMain = () => navigate(endpoint.HOME, -1)
    const navigation: DishesSearchViewNavigation = {
      quit: toMain,
      back: toMain,
      toCreate: () => navigate(route.NEW_RECIPE, { resolve: true }),
      toDish: (rid) => navigate(
        injectParams(route.RECIPE, { rid }), { resolve: true }
      )
    }

    return navigation
  },
  children: [
    { path: '/' },

    /** View the recipe */
    {
      path: [route.RECIPE, route.NEW_RECIPE],
      component: RecipeView,
      data: (
        { location: { pathname }, params: { rid } }
      ): RecipeViewNavigation => {
        const eventBus = useEventBus()
        const navigate = createNavigator()
        const currentPath = rid
          ? injectParams(route.RECIPE, { rid })
          : route.NEW_RECIPE
        const toList = () => navigate(
          substractSegments(pathname, currentPath),
          -1
        )
        const navigation: RecipeViewNavigation = {
          back: toList,
          quit: () => navigate(endpoint.HOME, -2),
          toProducts: () => navigate(route.PRODUCTS, { resolve: true }),
          toProduct: (pid: DataModel.Product['id']) => {
            navigate(
              injectParams(route.DISH, { id: pid, type: 'product' }),
              { resolve: true }
            )
          },
          // Trigger update somehow
          toTarget: () => {
            toList()
            eventBus.emit('update-recipes', null)
          }
        }

        return navigation
      },
      children: [
        { path: '/' },

        /** Edit mass of a product */
        {
          path: route.DISH,
          component: () => <DishView target="recipe" action="change" />,
          data: ({ location: { pathname }, params }): DishViewNavigation => {
            const navigate = createNavigator()
            const toRecipe = () => navigate(
              substractSegments(
                pathname,
                injectParams(route.DISH, params)
              ), -1
            )
            const navigation: DishViewNavigation = {
              back: toRecipe,
              quit: () => navigate(endpoint.HOME, -3),
              toTarget: toRecipe
            }
            return navigation
          }
        },

        /** List of products */
        {
          path: route.PRODUCTS,
          component: () => <DishesSearchView only="product" />,
          data: ({ location: { pathname } }): DishesSearchViewNavigation => {
            const navigate = createNavigator()
            const navigation: DishesSearchViewNavigation = {
              quit: () => navigate(endpoint.HOME, -3),
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
                  quit: () => navigate(endpoint.HOME, -4),
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
                  quit: () => navigate(endpoint.HOME, -4),
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
