import { useNavigate } from '@solidjs/router'
import classNames from 'classnames'
import { inject } from 'regexparam'
import { createMemo, createSelector, For, Show } from 'solid-js'
import { produce } from 'solid-js/store'
import { removeMeal } from '../../../api'
import { emoji } from '../../../constants/emoji'
import { useT } from '../../../i18n'
import { route } from '../../../routes/constants'
import { useStore } from '../../../store'
import { calculateMealNutrition } from '../../../utils/data'
import { normalizeDate } from '../../../utils/format'
import { timeToEmoji } from '../../../utils/timeToEmoji'
import { ListItem } from '../ListItem'
import styles from './styles.sass'

/**
 * Displays a list of meals
 */
export const MealList = () => {
  const t = useT()
  const navigate = useNavigate()
  const [store, setStore] = useStore()
  const isRemoveable = createSelector(() => normalizeDate(new Date()))
  const mealNutrition = createMemo<Array<DataModel.Meal & DataModel.Nutrition>>(
    () => {
      return store.meals.map<DataModel.Meal & DataModel.Nutrition>(meal => {
        return {
          ...meal,
          ...calculateMealNutrition(meal)
        }
      })
    }
  )

  function goToMeal(id: DataModel.Meal['id']) {
    const pathname = inject(
      route.MEAL,
      { id }
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
      <For each={mealNutrition()}>
        {(item, index) => (
          <ListItem
            identifier={item.id}
            onClick={() => goToMeal(item.id)}
            onRemove={
              isRemoveable(normalizeDate(item.time))
                ? () => deleteMeal(item, index())
                : undefined
            }
          >
            <div class={styles.item}>
              <div class={styles.clock}>
                {timeToEmoji(item.time).html}
                <div class={styles.time}>
                  {item.time.toTimeString().slice(0, 5)}
                </div>
              </div>

              <div class={styles.info}>
                <div class={classNames(styles.nutrients)}>
                  <div class={classNames(styles.nutrient, styles.protein)}>
                    <div class={styles['nutrient-caption']}>
                      {emoji.poultryLeg.html}
                      {/* {t('nutrients.P')}: */}
                    </div>
                    <div class={styles['nutrient-value']}>
                      {Math.round(item.proteins)} {' '}
                      <span class={styles.unit}>{t('unit.gram')}</span>
                    </div>
                  </div>

                  <div class={classNames(styles.nutrient, styles.fats)}>
                    <div class={styles['nutrient-caption']}>
                      {emoji.avocado.html}
                      {/* {t('nutrients.F')}: */}
                    </div>
                    <div class={styles['nutrient-value']}>
                      {Math.round(item.fats)} {' '}
                      <span class={styles.unit}>{t('unit.gram')}</span>
                    </div>
                  </div>

                  <div class={classNames(styles.nutrient, styles.carbs)}>
                    <div class={styles['nutrient-caption']}>
                      {emoji.cookedRice.html}
                      {/* {t('nutrients.C')}: */}
                    </div>
                    <div class={styles['nutrient-value']}>
                      {Math.round(item.carbs)} {' '}
                      <span class={styles.unit}>{t('unit.gram')}</span>
                    </div>
                  </div>
                </div>

                <div class={styles['energy-wrapper']}>
                  <div class={styles.energy}>
                    <b>{Math.round(item.energy)}</b> {' '}
                    <span class={styles.unit}>{t('unit.kcal')}</span>
                  </div>

                  <div class={styles.dishes}>
                    {item.dishes[0].target.name}
                    <Show when={item.dishes.length > 1}>
                      {' '}
                      {t('label.and_more', { count: item.dishes.length - 1 })}
                    </Show>
                  </div>
                </div>
              </div>
            </div>
          </ListItem>
        )}
      </For>
    </div>
  )
}
