import { Outlet, useParams, useRouteData } from '@solidjs/router'
import {
  Component,
  createMemo,
  createSignal,
  For,
  Match,
  onMount,
  Show,
  Switch
} from 'solid-js'
import { produce } from 'solid-js/store'
import { addMeal } from '../../../api'
import { useT } from '../../../i18n'
import { BasicViewNavigation } from '../../../routes/types'
import { useProfile, useStore } from '../../../store'
import { ListItem } from '../../../types/utils'
import {
  getMealLabelFromDate,
  isDishProduct,
  isDishRecipe
} from '../../../utils/data'
import { normalizeDate, normalizeTime } from '../../../utils/format'
import { PlusIcon } from '../../icons/PlusIcon'
import { Container } from '../../layout/Grid'
import { ProductListItem } from '../../lists/ProductList'
import { RecipeListItem } from '../../lists/RecipeList'
import { useEventBus } from '../../providers/EventBus'
import { Button } from '../../ui/Button'
import { ButtonPanel } from '../../ui/ButtonPanel/ButtonPanel'
import { Dialog } from '../../ui/Dialog'
import { Form, getFormValues } from '../../ui/Form'
import { FormSubmitEvent } from '../../ui/Form/types'
import { MealViewFormFields } from './MealViewFormFields'
import styles from './styles.sass'
import { MealViewFormValues } from './types'

export interface MealViewNavigation extends BasicViewNavigation {
  toDishes: () => void
  toDish: (id: DataModel.ID, type: DataModel.DishType, amount?: number) => void
}

type MealViewComponent = Component

/**
 * Allows to create/view a meal
 */
export const MealView: MealViewComponent = () => {
  const go = useRouteData<MealViewNavigation>()
  const eventBus = useEventBus()
  const [store, setStore] = useStore()
  const params = useParams<{ mid: string }>()
  const t = useT()
  const user = useProfile()
  const targetMeal = createMemo(() => {
    if (params.mid) {
      return store.meals.find(m => m.id === +params.mid)
    }
    return undefined
  })
  const dialogHeader = createMemo(() => {
    const mealObject = targetMeal()
    if (!mealObject) return t('dialog.meal.add')

    const mealLabel = mealObject.label
      ? mealObject.label
      : getMealLabelFromDate(mealObject.time)

    return `${normalizeTime(mealObject.time)}, ${
      t(`mealLabel.${mealLabel}`)}`
  })
  const [dishes, setDishes] = createSignal<DataModel.Dish[]>(
    targetMeal() ? targetMeal()!.dishes : []
  )
  const isSaveable = createMemo(() => dishes().length > 0)

  const isConvertableToRecipe = createMemo(() => {
    const meal = targetMeal()
    if (!meal) return false

    return !meal.dishes.some(dish => isDishRecipe(dish) || dish.isArchieved)
  })

  function addMealToStore(meal: DataModel.Meal) {
    setStore(
      produce((s) => {
        if (s.journal?.date === normalizeDate(new Date())) {
          s.meals?.unshift(meal)
        }
      })
    )
  }

  function createMeal(time: Date, label: DataModel.MealLabel) {
    if (!isSaveable()) return

    addMeal({
      userId: user.id,
      time,
      label,
      dishes: dishes()
    })
      .then((meal) => {
        addMealToStore(meal)

        go.quit()
      })
      .catch(console.error)
  }

  function mergeDish(
    prev: ListItem<ReturnType<typeof dishes>>,
    next: ListItem<ReturnType<typeof dishes>>,
    replace: boolean
  ): ListItem<ReturnType<typeof dishes>> {
    if (isDishRecipe(prev) && isDishRecipe(next)) {
      return replace ? next : {
        ...prev,
        portion: prev.portion + next.portion
      }
    } if (isDishProduct(prev) && isDishProduct(next)) {
      return replace ? next : { ...prev, mass: prev.mass + next.mass }
    }

    return prev
  }

  function addDish(dish: ListItem<ReturnType<typeof dishes>>) {
    updateDish(dish, true)
  }

  function updateDish(
    dish: ListItem<ReturnType<typeof dishes>>,
    replace = true
  ) {
    const currentDishes = dishes()

    if (
      currentDishes
        .some(d => d.target.id === dish.target.id && d.type === dish.type)
    ) {
      setDishes(v => v.map(d => {
        if (d.target.id === dish.target.id && d.type === dish.type) {
          return mergeDish(d, dish, replace)
        }

        return d
      }))
    } else {
      setDishes(v => [...v, dish])
    }
  }

  function removeDish(i: number) {
    const nextDishes = dishes().slice()
    nextDishes.splice(i, 1)

    setDishes(nextDishes)
  }

  function changeDishAmount(dish: DataModel.Dish, amount?: number) {
    go.toDish(dish.target.id, dish.type, amount)
  }

  function handleSubmit(e: FormSubmitEvent) {
    e.preventDefault()

    const values = getFormValues<MealViewFormValues>(e.currentTarget)
    const [hours, minutes] = values.time.split(':')
    const time = new Date()
    time.setHours(+hours)
    time.setMinutes(+minutes)

    createMeal(time, values.label)
  }

  onMount(() => {
    eventBus.on('meal-dish-add', addDish)
    eventBus.on('meal-dish-change', updateDish)
  })

  return (
    <>
      <Form<MealViewFormValues>
        autocomplete="off"
        onSubmit={handleSubmit}
        defaults={{
          time: normalizeTime(new Date()),
          label: getMealLabelFromDate()
        }}
      >
        <Dialog
          class={styles.wrapper}
          onClose={go.quit}
          onBack={go.back}
          header={
            <h2>{dialogHeader()}</h2>
          }
          footer={
            <Show
              when={!targetMeal()}
              fallback={
                <ButtonPanel justify={isConvertableToRecipe() ? 'start' : 'start'}>
                  <Button color="secondary" onClick={go.back}>
                    {t('button.back')}
                  </Button>

                  {/* <Show when={isConvertableToRecipe()}>
                  <Button
                    half block
                    outline color="primary"
                  >
                    {t('button.save_as_recipe')}
                  </Button>
                </Show> */}
                </ButtonPanel>
              }
            >
              <ButtonPanel>
                <Button color="secondary" onClick={go.back}>
                  {t('button.cancel')}
                </Button>

                <Button
                  half block
                  type="submit"
                  color="accent"
                  disabled={!isSaveable()}
                  // onClick={createMeal}
                >
                  {t('button.save')}
                </Button>

                <Button color="primary" onClick={go.toDishes}>
                  <PlusIcon />
                </Button>
              </ButtonPanel>
            </Show>
          }
        >
          <Container>
            <Show when={!targetMeal()}>
              <MealViewFormFields />
            </Show>

            <For each={dishes()}>
              {(item, index) => (
                <Switch>
                  <Match when={isDishProduct(item)}>
                    <ProductListItem
                      caption={item.target.name}
                      identifier={index()}
                      mass={(item as DataModel.Dish<DataModel.BasicProduct>).mass}
                      product={(item as DataModel.Dish<DataModel.BasicProduct>).target}
                      onClick={
                        () => changeDishAmount(
                          item,
                          (item as DataModel.Dish<DataModel.BasicProduct>).mass
                        )
                      }
                      onRemove={!targetMeal() ? removeDish : undefined}
                    />
                  </Match>
                  <Match when={isDishRecipe(item)}>
                    <RecipeListItem
                      detailed
                      caption={item.target.name}
                      identifier={index()}
                      portion={(item as DataModel.Dish<DataModel.BasicRecipe>).portion}
                      recipe={(item as DataModel.Dish<DataModel.BasicRecipe>).target}
                      onClick={
                        () => changeDishAmount(
                          item,
                          (item as DataModel.Dish<DataModel.BasicRecipe>).portion
                        )
                      }
                      onRemove={!targetMeal() ? removeDish : undefined}
                    />
                  </Match>
                </Switch>
              )}
            </For>
          </Container>
        </Dialog>

      </Form>

      <Outlet />
    </>
  )
}
