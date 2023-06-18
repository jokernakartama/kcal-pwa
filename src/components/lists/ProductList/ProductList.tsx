import { JSX, Component, For, splitProps, createSignal, createEffect, on, createMemo, onMount } from 'solid-js'
import { getProducts, removeProduct } from '../../../api'
import { useT } from '../../../i18n'
import { useProfile, useStore } from '../../../store'
import { PaginationParams, SortingDirection } from '../../../types/pagination'
import { useEventBus } from '../../providers/EventBus'
import { PageScroll } from '../../ui/PageScroll/PageScroll'
import { ProductListItem } from './ProductListItem'

type ProductListComponent = Component<
JSX.IntrinsicElements['div'] & {
  /** Id or array of ids of products */
  products?: number | number[]
  search?: string,
  sort?: 'name' | 'energy' | 'id'
  dir?: SortingDirection
  onProductClick?: (product: DataModel.Product) => void
}
>

/**
 * Renders scrollable paginated products list
 */
export const ProductList: ProductListComponent = props => {
  const eventBus = useEventBus()
  const t = useT()
  const [, setStore] = useStore()
  const user = useProfile()
  const [local, rest] = splitProps(props, [
    'class', 'products', 'search', 'sort', 'dir', 'onProductClick'
  ])
  const searchString = createMemo(() => props.search)
  const productsSignal = createSignal<DataModel.Product[] | undefined>([])
  const [products, setProducts] = productsSignal

  function fetchProducts({ offset, limit }: PaginationParams) {
    return getProducts(user.id, {
      id: local.products,
      name: local.search,
      sort: local.sort ?? 'id',
      dir: local.dir ?? 'desc',
      limit, offset
    })
  }

  function deleteProduct(id: DataModel.Product['id']) {
    removeProduct(id)
      .then(() => {
        setProducts(v => v!.filter(product => product.id !== id))
        markProductInStore(id)
      })
      .catch(e => {
        console.error(e)
      })
  }

  function markProductInStore(id: DataModel.Product['id']) {
    setStore(
      'meals',
      meal => meal.dishes.some(
        dish => dish.type === 'product' && dish.target.id === id
      ),
      'dishes',
      dishes => dishes.map(dish => {
        if (dish.type === 'product' && dish.target.id === id) {
          return {
            isArchieved: true,
            ...dish,
          }
        }

        return dish
      })
    )
  }

  function handleProductClick(product: DataModel.Product) {
    if (typeof local.onProductClick === 'function') {
      local.onProductClick(product)
    }
  }

  function updateProducts() {
    // This action will update the list because of internal mechanism
    // of `PageScroll`
    setProducts([])
  }

  createEffect(on(searchString, () => {
    setProducts(undefined)
  }))

  onMount(() => {
    eventBus.on('update-products', updateProducts)
  })

  return (
    <PageScroll<DataModel.Product>
      class={local.class}
      fetch={fetchProducts}
      signal={productsSignal}
      {...rest}
    >
      <For each={products()} fallback={t('products.empty')}>
        {item => (
          <ProductListItem
            caption={item.name}
            identifier={item.id}
            product={item}
            onClick={() => handleProductClick(item)}
            onRemove={deleteProduct}
          />
        )}
      </For>
    </PageScroll>
  )
}
