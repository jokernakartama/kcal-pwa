import { useParams } from '@solidjs/router'
import { Component, createResource } from 'solid-js'
import { getProduct, getRecipe } from '../../../api'
import { createRewindNavigator } from '../../../hooks/createRewindNavigator'
import { useT } from '../../../i18n'
import { route } from '../../../routes/constants'
import { useStore } from '../../../store'
import { getDishFromAnything } from '../../../utils/data'
import { DishForm, DishFormValues } from '../../forms/DishForm'
import { Container } from '../../layout/Grid'
import { Button } from '../../ui/Button'
import { ButtonPanel } from '../../ui/ButtonPanel/ButtonPanel'
import { Dialog } from '../../ui/Dialog'
import { Form, getFormValues } from '../../ui/Form'
import { FormSubmitEvent } from '../../ui/Form/types'
import styles from './styles.sass'

/**
 * Provides interface to add some amount of a product/recipe to the meal
 */
export const DishView: Component = () => {
  const t = useT()
  const params = useParams<{ type: 'product' | 'recipe', id: string }>()
  const [, setStore] = useStore()
  const rewind = createRewindNavigator()
  const [dish] = createResource<
  DataModel.Product | DataModel.Recipe | undefined
  >(fetchDish)

  function goNext() {
    rewind(route.NEW_MEAL, -2)
  }

  function goBack() {
    rewind(route.DISH_LIST, -1)
  }

  function goToMain() {
    rewind(route.HOME, -3)
  }

  function addDish(amount: number) {
    const target = dish()
    if (typeof target === 'undefined') return undefined

    return setStore(
      'dishes',
      l => [...l, getDishFromAnything(target, amount)]
    )
  }

  function handleSubmit(e: FormSubmitEvent) {
    e.preventDefault()

    const values = getFormValues<DishFormValues>(
      e.currentTarget
    )

    addDish(values.amount)

    goNext()
  }

  function fetchDish() {
    if (params.type === 'recipe') {
      return getRecipe(
        +params.id
      )
    }

    return getProduct(
      +params.id
    )
  }

  return (
    <Form autocomplete="off" onSubmit={handleSubmit}>
      <Dialog
        class={styles.wrapper}
        onBack={goBack}
        onClose={goToMain}
        header={
          <h2>{t(`dialog.dish.${params.type === 'recipe'
            ? 'add_recipe'
            : 'add_product'
          }`)}</h2>
        }
        footer={
          <>
            <ButtonPanel>
              <Button color="secondary" onClick={goBack}>
                {t('button.back')}
              </Button>
              <Button half block disabled={!dish()} type="submit" color="primary">
                {t('button.add')}
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
