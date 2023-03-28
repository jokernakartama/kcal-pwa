import { useNavigate, useParams } from '@solidjs/router'
import { Component, createMemo, For, Show } from 'solid-js'
import { produce } from 'solid-js/store'
import { addMeal } from '../../../api'
import { createRewindNavigator } from '../../../hooks/createRewindNavigator'
import { useT } from '../../../i18n'
import { route } from '../../../routes/constants'
import { useProfile, useStore } from '../../../store'
import {
  calculateProductNutrition,
  calculateRecipeNutrition,
  isDishRecipe
} from '../../../utils/data'
import { normalizeDate } from '../../../utils/format'
import { PlusIcon } from '../../icons/PlusIcon'
import { Container } from '../../layout/Grid'
import { NutritionItem } from '../../lists/NutiritionItem/NutritionItem'
import { Button } from '../../ui/Button'
import { ButtonPanel } from '../../ui/ButtonPanel/ButtonPanel'
import { Dialog } from '../../ui/Dialog'
import styles from './styles.sass'

type MealViewComponent = Component

/**
 * Allows to create/view a meal
 */
export const MealView: MealViewComponent = () => {
  const [store, setStore] = useStore()
  const params = useParams<{ id: string }>()
  const t = useT()
  const user = useProfile()
  const navigate = useNavigate()
  const rewind = createRewindNavigator()
  const isSaveable = createMemo(() => store.dishes.length > 0)
  const targetMeal = createMemo(() => {
    if (params.id) {
      return store.meals.find(m => m.id === +params.id)
    }
    return undefined
  })

  const dishes = createMemo(() => {
    const source = targetMeal() ? targetMeal()!.dishes : store.dishes

    return source.map(dish => {
      if (isDishRecipe(dish)) {
        return {
          ...calculateRecipeNutrition(dish.target, dish.portion),
          caption: dish.target.name,
          portion: dish.portion,
          mass: dish.target
            .products
            .reduce((mass, product) => mass + product.mass * dish.portion, 0)
        }
      }

      return {
        ...calculateProductNutrition(dish.target, dish.mass),
        caption: dish.target.name,
        portion: undefined,
        mass: dish.mass
      }
    })
  })

  function goToDishList() {
    navigate(route.DISH_LIST, { replace: false })
  }

  function goToMain() {
    rewind(route.HOME, -1)
  }

  function addMealToStore(meal: DataModel.Meal) {
    setStore(
      produce((s) => {
        s.dishes = []

        if (s.journal?.date === normalizeDate(new Date())) {
          s.meals?.unshift(meal)
        }
      })
    )
  }

  function createMeal() {
    if (!isSaveable()) return

    addMeal({
      userId: user.id,
      dishes: store.dishes
        // Map here because store.dishes is a Proxy
        // `structuredClone` cannot be applied here as well
        .map(d => ({ ...d, target: { ...d.target } })) as DataModel.Dish[]
    })
      .then((meal) => {
        addMealToStore(meal)

        goToMain()
      })
      .catch(console.error)
  }

  function removeDish(i: number) {
    setStore(
      produce((s) => {
        s.dishes?.splice(i, 1)
      })
    )
  }

  return (
    <Dialog
      class={styles.wrapper}
      onClose={goToMain}
      onBack={goToMain}
      header={
        <h2>{targetMeal()
          ? `${targetMeal()!.time.toLocaleString()}`
          : t('dialog.meal.add')}
        </h2>
      }
      footer={
        <Show
          when={!targetMeal()}
          fallback={
            <ButtonPanel justify="start">
              <Button color="secondary" onClick={goToMain}>
                {t('button.back')}
              </Button>
            </ButtonPanel>
          }
        >
          <ButtonPanel>
            <Button color="secondary" onClick={goToMain}>
              {t('button.cancel')}
            </Button>

            <Button
              half block
              color="accent"
              disabled={!isSaveable()}
              onClick={createMeal}
            >
              {t('button.save')}
            </Button>

            <Button color="primary" onClick={goToDishList}>
              <PlusIcon />
            </Button>
          </ButtonPanel>
        </Show>
      }
    >
      <Container>
        <For each={dishes()}>
          {(item, index) => (
            <NutritionItem
              caption={item.caption}
              portion={item.portion}
              identifier={index()}
              proteins={item.proteins}
              fats={item.fats}
              carbs={item.carbs}
              energy={item.energy}
              mass={item.mass}
              onRemove={!targetMeal() ? removeDish : undefined}
            />
          )}
        </For>
      </Container>
    </Dialog>
  )
}
