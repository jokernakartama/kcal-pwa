import classNames from 'classnames'
import {
  Component,
  createResource,
  createSignal,
  For,
  Show
} from 'solid-js'
import { getProducts, getRecipes, removeProduct, setProduct } from '../../../api'
import { useStore } from '../../../store'
import { ProductForm } from '../../forms/ProductForm'
import { FilterPanel } from '../../layout/FilterPanel'
import { Button } from '../../ui/Button'
import { Panel } from '../../ui/Panel'
import styles from './styles.sass'

type CookBookComponent = Component<{
  class?: string
}>

export const CookBook: CookBookComponent = (props) => {
  const [store] = useStore()
  const [isOpen, setIsOpen] = createSignal<boolean>(false)
  const [products, { refetch }] = createResource(
    () => {
      return store.user !== undefined
    },
    fetchProducts
  )
  const [recipes] = createResource(
    () => {
      return store.user !== undefined
    },
    fetchRecipes
  )

  function fetchProducts() {
    return getProducts(store.user!.id)
  }

  function fetchRecipes() {
    return getRecipes(store.user!.id)
  }

  function handleSubmit(values: Omit<DataModel.Product, 'id' | 'userId'>) {
    setProduct({
      ...values,
      userId: store.user!.id
    })
      .then(() => {
        setIsOpen(false)
        refetch()
      })
  }

  function removeProd (id: DataModel.Product['id']) {
    removeProduct(id)
      .then(() => {
        refetch()
      })
  }

  return (
    <>
      <FilterPanel>
        some filters
      </FilterPanel>

      <div class={classNames(props.class, styles.wrapper)}>
        <Show when={!isOpen()}>
          <Button color="accent" onClick={() => setIsOpen(true)} >
            Add a product
          </Button>

          <For each={products()?.items} fallback={<div>Загрузка...</div>}>
            {item => (
              <div class={styles.product}>
                <div class={styles.title}>
                  {item.name}
                  <button onClick={() => removeProd(item.id)}>X</button>
                </div>
                <div>
                  <small>
                    E: {item.kcalories} kkal
                    P: {item.proteins} g
                    F: {item.fats} g
                    C: {item.carbohydrates} g
                  </small>
                </div>
              </div>
            )}
          </For>
          <pre>
            {JSON.stringify(recipes(), null, '  ')}
          </pre>
        </Show>

        <Show when={isOpen()}>
          <Panel>
            <ProductForm onSubmit={handleSubmit}/>
          </Panel>
        </Show>

      </div>
    </>
  )
}
