import classNames from 'classnames'
import {
  Component,
  createResource,
  createSignal,
  Show
} from 'solid-js'
import { getProducts, getRecipes, setProduct } from '../../../api'
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
  const [products] = createResource(
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

  function handleSubmit(values: DataModel.Product) {
    setProduct({
      ...values,
      userId: store.user!.id
    })
      .then(() => {
        setIsOpen(false)
        fetchProducts()
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
          <pre>
            {JSON.stringify(products(), null, '  ')}
          </pre>
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
