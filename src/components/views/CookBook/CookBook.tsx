import classNames from 'classnames'
import {
  Component,
  createResource
} from 'solid-js'
import { getProducts, getRecipes } from '../../../api'
import { useStore } from '../../../store'
import { FilterPanel } from '../../layout/FilterPanel'
import styles from './styles.sass'

type CookBookComponent = Component<{
  class?: string
}>

export const CookBook: CookBookComponent = (props) => {
  const [store] = useStore()
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

  return (
    <>
      <FilterPanel>
        some filters
      </FilterPanel>

      <div class={classNames(props.class, styles.wrapper)}>
        <pre>
          {JSON.stringify(products(), null, '  ')}
        </pre>
        <pre>
          {JSON.stringify(recipes(), null, '  ')}
        </pre>
      </div>
    </>
  )
}
