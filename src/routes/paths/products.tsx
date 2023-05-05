import { RouteDefinition } from '@solidjs/router'
import { useEventBus } from '../../components/providers/EventBus'
import { DishesSearchView, DishesSearchViewNavigation } from '../../components/views/DishesSearchView'
import { ProductView, ProductViewNavigation } from '../../components/views/ProductView'
import { createNavigator } from '../../hooks/createNavigator'
import { injectParams, substractSegments } from '../../utils/routing'
import { endpoint, route } from '../constants'

/**
 * Set of paths to manage products
 */
export const productsPath: RouteDefinition = {
  path: route.PRODUCTS,
  component: () => <DishesSearchView only="product" />,
  data: (): DishesSearchViewNavigation => {
    const navigate = createNavigator()
    const toMain = () => navigate(endpoint.HOME, -1)
    const navigation: DishesSearchViewNavigation = {
      quit: toMain,
      back: toMain,
      toCreate: () => navigate(route.NEW_PRODUCT, { resolve: true }),
      toDish: (pid) => navigate(
        injectParams(route.PRODUCT, { pid }), { resolve: true }
      )
    }

    return navigation
  },
  children: [
    { path: '/' },

    {
      path: [route.PRODUCT, route.NEW_PRODUCT],
      component: ProductView,
      data: (
        { location: { pathname }, params: { pid } }
      ): ProductViewNavigation => {
        const eventBus = useEventBus()
        const navigate = createNavigator()
        const currentPath = pid
          ? injectParams(route.PRODUCT, { pid })
          : route.NEW_PRODUCT
        const toList = () => navigate(
          substractSegments(pathname, currentPath), -1
        )
        const navigation: ProductViewNavigation = {
          back: toList,
          quit: () => navigate(endpoint.HOME, -2),
          toTarget: () => {
            toList()
            eventBus.emit('update-products', null)
          }
        }

        return navigation
      }
    }
  ]
}
