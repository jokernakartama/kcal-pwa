import { createMemo, createSelector, For } from 'solid-js'
import { produce } from 'solid-js/store'
import { removeMeal } from '../../../api'
import { createNavigator } from '../../../hooks/createNavigator'
import { route } from '../../../routes/constants'
import { useStore } from '../../../store'
import { calculateMealNutrition } from '../../../utils/data'
import { normalizeDate } from '../../../utils/format'
import { injectParams } from '../../../utils/routing'
import { MealListItem } from './MealListItem'
import styles from './styles.sass'

/**
 * Displays a list of meals
 */
export const MealList = () => {
  const navigate = createNavigator()
  const [store, setStore] = useStore()
  const isRemoveable = createSelector(() => normalizeDate(new Date()))
  const mealsWithNutrition = createMemo<Array<DataModel.Meal & DataModel.Nutrition>>(
    () => {
      const meals = store.meals.map<DataModel.Meal & DataModel.Nutrition>(meal => {
        return {
          ...meal,
          ...calculateMealNutrition(meal)
        }
      })

      meals.sort((a, b) => {
        return a.time > b.time ? -1 : a.time < b.time ? 1 : 0
      })

      return meals
    }
  )

  function goToMeal(mid: DataModel.Meal['id']) {
    const pathname = injectParams(
      route.MEAL,
      { mid }
    )

    navigate(pathname)
  }

  function deleteMeal(meal: DataModel.Meal, i: number) {
    if (normalizeDate(new Date()) !== normalizeDate(meal.time)) return

    removeMeal(meal.id)
      .then(()=> {
        setStore(
          produce((s) => {
            s.meals?.splice(i, 1)
          })
        )
      })
      .catch(console.error)
  }

  return (
    <div class={styles.wrapper}>
      <For each={mealsWithNutrition()}>
        {(item, index) => (
          <MealListItem
            identifier={item.id}
            meal={item}
            proteins={item.proteins}
            fats={item.fats}
            carbs={item.carbs}
            energy={item.energy}
            onRemove={
              isRemoveable(normalizeDate(item.time))
                ? () => deleteMeal(item, index())
                : undefined
            }
            onClick={() => goToMeal(item.id)}
          />
        )}
      </For>
    </div>
  )
}
