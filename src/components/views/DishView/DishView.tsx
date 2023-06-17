import { useParams, useRouteData, useSearchParams } from '@solidjs/router'
import { Component, createResource } from 'solid-js'
import { getProduct, getRecipe } from '../../../api'
import { useT } from '../../../i18n'
import { BasicViewNavigation } from '../../../routes/types'
import { QueryParams } from '../../../types/utils'
import { getDishFromAnything, isRecipe } from '../../../utils/data'
import { DishForm, DishFormValues } from '../../forms/DishForm'
import { Container } from '../../layout/Grid'
import { useEventBus } from '../../providers/EventBus'
import { Button } from '../../ui/Button'
import { ButtonPanel } from '../../ui/ButtonPanel/ButtonPanel'
import { Dialog } from '../../ui/Dialog'
import { Form, getFormValues } from '../../ui/Form'
import { FormSubmitEvent } from '../../ui/Form/types'
import styles from './styles.sass'

export interface DishViewNavigation extends BasicViewNavigation {
  /**
   * Goes to the parent entity view: a meal or a recipe
   */
  toTarget: () => void
}

type DishViewComponent = Component<{
  /**
   * Parent entity view: a meal or a recipe
   */
  target?: 'meal' | 'recipe'
  /**
   * What kind of action is to be executed: changing the value of an existing
   * item or add a new one.
   * Changing an existing one is used by default as it is a more safe action:
   * in case if the dish is not present in the target's list it will be added.
   */
  action?: 'change' | 'add'
}>

/**
 * Provides interface to add some amount of a product/recipe to the meal
 */
export const DishView: DishViewComponent = props => {
  const go = useRouteData<DishViewNavigation>()
  const [query] = useSearchParams<QueryParams<DishFormValues>>()
  const eventBus = useEventBus()
  const t = useT()
  const params = useParams<{ type: 'product' | 'recipe', id: string }>()
  const [dish] = createResource<
  DataModel.BasicProduct | DataModel.BasicRecipe | undefined
  >(fetchDish)

  function addRecipeIngredient(product: DataModel.BasicProduct, amount: number) {
    const ingredient = { ...product, mass: amount }

    if (props.action === 'add') {
      eventBus.emit('recipe-product-add', ingredient)
    } else {
      eventBus.emit('recipe-product-change', ingredient)
    }
  }

  function addMealDish(
    mealDish: DataModel.BasicProduct | DataModel.BasicRecipe,
    amount: number
  ) {
    if (props.action === 'add') {
      eventBus.emit('meal-dish-add', getDishFromAnything(mealDish, amount))
    } else {
      eventBus.emit('meal-dish-change', getDishFromAnything(mealDish, amount))
    }
  }

  function sendChanges(amount: number) {
    const payload = dish()
    if (typeof payload === 'undefined') return

    if (props.target === 'recipe' && !isRecipe(payload)) {
      addRecipeIngredient(payload as DataModel.BasicProduct, amount)
    } else {
      addMealDish(payload, amount)
    }
  }

  function handleSubmit(e: FormSubmitEvent) {
    e.preventDefault()

    const values = getFormValues<DishFormValues>( e.currentTarget)

    sendChanges(values.amount)
    go.toTarget()
  }

  function fetchDish() {
    if (!params.id) return Promise.reject(JSON.stringify(params))
    if (params.type === 'recipe') {
      return getRecipe(+params.id)
    }

    return getProduct(
      +params.id
    )
  }

  return (
    <Form
      autocomplete="off"
      defaults={query.amount ? { amount: +query.amount } : undefined }
      onSubmit={handleSubmit}
    >
      <Dialog
        class={styles.wrapper}
        onBack={go.back}
        onClose={go.quit}
        header={
          <h2>{t(`dialog.dish.${props.action || 'change'}_${params.type}`)}</h2>
        }
        footer={
          <>
            <ButtonPanel>
              <Button color="secondary" onClick={go.back}>
                {t('button.back')}
              </Button>
              <Button half block disabled={!dish()} type="submit" color="primary">
                {t(`button.${props.action || 'change'}`)}
              </Button>
            </ButtonPanel>
          </>
        }
      >
        <Container>
          <DishForm type={params.type} target={dish()} />
        </Container>
      </Dialog>
    </Form>
  )
}
