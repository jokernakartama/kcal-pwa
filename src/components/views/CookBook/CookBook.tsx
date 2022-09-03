import classNames from 'classnames'
import {
  Component,
  createMemo,
  createResource,
  createSignal,
  For,
  Show
} from 'solid-js'
import { addMeal, getProducts, getRecipes, removeProduct, setProduct } from '../../../api'
import { useT } from '../../../i18n'
import { useStore } from '../../../store'
import { normalizeDate } from '../../../utils/format'
import { MealForm } from '../../forms/MealForm'
import { ProductForm } from '../../forms/ProductForm'
// import { FilterPanel } from '../../layout/FilterPanel'
import { Button } from '../../ui/Button'
import { Panel } from '../../ui/Panel'
import styles from './styles.sass'

type CookBookComponent = Component<{
  class?: string
}>

export const CookBook: CookBookComponent = (props) => {
  const t = useT()
  const [store, setStore] = useStore()
  const [isOpen, setIsOpen] = createSignal<boolean>(false)
  const [openProduct, setOpenProduct] = createSignal<DataModel.Product | undefined>()
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

  const mealForm = createMemo(() => {
    const product = openProduct()

    if (product !== undefined) {
      return <MealForm product={product} onSubmit={logMeal}/>
    }
    return null
  })

  const productForm = createMemo(() => {
    if (isOpen()) {
      return <ProductForm onSubmit={handleSubmit}/>
    }
    return null
  })

  function showProductDialog(product: DataModel.Product) {
    setOpenProduct(product)
  }

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
        return refetch()
      })
      .catch(e => {
        console.error(e)
      })
  }

  function removeProd(id: DataModel.Product['id']) {
    removeProduct(id)
      .then(() => {
        return refetch()
      })
      .catch(e => {
        console.error(e)
      })
  }

  function logMeal(values: Pick<DataModel.Meal, 'mass'>) {
    addMeal({
      ...values,
      recordId: store.journal?.id,
      time: (new Date()),
      product: openProduct(),
      userId: store.user!.id
    })
      .then((meal) => {
        if (typeof store.journal !== 'undefined') {
          setStoreJournalRecord(meal)
        }

        setOpenProduct()

      })
      .catch(e => {
        console.error(e)
      })
  }

  function setStoreJournalRecord(meal: DataModel.Meal) {
    setStore({
      journal: {
        id: meal.recordId,
        userId: meal.userId,
        date: normalizeDate(meal.time)
      }
    })
  }

  return (
    <>
      {/* <FilterPanel>
        some filters
      </FilterPanel> */}

      <div class={classNames(props.class, styles.wrapper)}>
        <Show when={!isOpen() && openProduct() === undefined}>
          <Button color="accent" onClick={() => setIsOpen(true)} >
            Add a product
          </Button>

          <For each={products()?.items} fallback={<div>Загрузка...</div>}>
            {item => (
              <div class={styles.product} onClick={() => showProductDialog(item)}>
                <div class={styles.title}>
                  {item.name}
                  <button onClick={() => removeProd(item.id)}>X</button>
                </div>
                <div>
                  <small>
                    {t('nutrients.E')}: {item.kcalories} {t('unit.kcal')}{' | '}
                    {t('nutrients.P')}: {item.proteins} {t('unit.gram')}{' | '}
                    {t('nutrients.F')}: {item.fats} {t('unit.gram')}{' | '}
                    {t('nutrients.C')}: {item.carbohydrates} {t('unit.gram')}
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
            {productForm()}
          </Panel>
        </Show>

        <Show when={openProduct !== undefined}>
          <Panel>
            {mealForm()}
          </Panel>
        </Show>

      </div>
    </>
  )
}
