import { useParams } from '@solidjs/router'
import classNames from 'classnames'
import {
  Component,
  createMemo,
  createResource,
  createSignal,
  Match,
  Show,
  Switch
} from 'solid-js'
import { getProduct, getRecipe } from '../../../api'
import { emoji } from '../../../constants/emoji'
import { createRewindNavigator } from '../../../hooks/createRewindNavigator'
import { useT } from '../../../i18n'
import { route } from '../../../routes/constants'
import { useStore } from '../../../store'
import {
  calculateProductNutrition,
  calculateRecipeNutrition,
  getDishFromAnything,
  isRecipe
} from '../../../utils/data'
import { DishNutrition } from '../../informers/DishNutrition'
import { Container } from '../../layout/Grid'
import { Button } from '../../ui/Button'
import { ButtonPanel } from '../../ui/ButtonPanel/ButtonPanel'
import { Dialog } from '../../ui/Dialog'
import { Form, getFormValues } from '../../ui/Form'
import { FormSubmitEvent } from '../../ui/Form/types'
import { TextInput } from '../../ui/TextInput'
import { TextInputChangeEvent } from '../../ui/TextInput/types'
import styles from './styles.sass'

/**
 * Provides interface to add some amount of a product/recipe to the meal
 */
export const DishView: Component = () => {
  const t = useT()
  const params = useParams<{ type: 'product' | 'recipe', id: string }>()
  const [, setStore] = useStore()
  const rewind = createRewindNavigator()
  const [mass, setMass] = createSignal<number>(100)
  const [portion, setPortion] = createSignal<number>(1)
  const [dish] = createResource<
  DataModel.Product | DataModel.Recipe | undefined
  >(fetchDish)
  const dishNutrition = createMemo<DataModel.Nutrition | undefined >(() => {
    const target = dish()
    if (!target) return undefined

    if (isRecipe(target)) {
      return calculateRecipeNutrition(target, portion())
    }
    return calculateProductNutrition(target, mass() ?? 0)

  })
  const dishBasicNutrition = createMemo<DataModel.Nutrition | undefined >(() => {
    const target = dish()
    if (!target) return undefined

    if (isRecipe(target)) {
      return calculateRecipeNutrition(target, 1)
    }
    return calculateProductNutrition(target, 100)

  })

  function handleMassInput(e: TextInputChangeEvent) {
    setMass(+e.currentTarget.value)
  }

  function handlePortionInput(e: TextInputChangeEvent) {
    setPortion(+e.currentTarget.value)
  }

  function goNext() {
    // Fint ushami to implement app-like navigation
    rewind(route.NEW_MEAL, -2)
  }

  function goBack() {
    rewind(route.DISH_LIST, -1)
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

    const values = getFormValues<{ amount: number }>(
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
        onClose={goBack}
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
          <Show when={dish}>
            <h2 class="m-mb-1">{dish()?.name}</h2>

            <div class={classNames(styles['basic-nutrients'], 'm-mb-2')}>
              {t(`dialog.dish.${params.type === 'recipe'
                ? 'per_portion'
                : 'per_100g'
              }`)}:
              <span class={styles['basic-values']}>
                <span>
                  {emoji.highVoltage.html}{' '}
                  <b>{dishBasicNutrition()?.energy}</b> {t('unit.kcal')}
                </span>
                <span>
                  {emoji.poultryLeg.html}{' '}
                  <b>{dishBasicNutrition()?.proteins}</b> {t('unit.gram')}
                </span>
                <span>
                  {emoji.avocado.html}{' '}
                  <b>{dishBasicNutrition()?.fats}</b> {t('unit.gram')}
                </span>
                <span>
                  {emoji.cookedRice.html}{' '}
                  <b>{dishBasicNutrition()?.carbs}</b> {t('unit.gram')}
                </span>
              </span>
            </div>
          </Show>

          <Switch>
            <Match when={params.type === 'product'}>
              <TextInput
                required
                clearable
                autofocus
                name="amount"
                value={mass()}
                type="number"
                icon="scales"
                class="m-mb-3"
                min="1"
                step="1"
                max="5000"
                maxlength="4"
                placeholder={`${t('nutrients.mass')}, ${t('unit.gram')}`}
                onInput={handleMassInput}
              />
            </Match>

            <Match when={params.type === 'recipe'}>
              <TextInput
                required
                clearable
                autofocus
                name="amount"
                value={portion()}
                type="number"
                icon="forkAndKnife"
                class="m-mb-3"
                min="1"
                max="5"
                step="1"
                placeholder={t('nutrients.portion')}
                onInput={handlePortionInput}
              />
            </Match>
          </Switch>

          <Show when={!!dish()}>
            <DishNutrition
              class="m-mb-2"
              {...dishNutrition()!}
            />
          </Show>

        </Container>
      </Dialog>
    </Form>
  )
}
