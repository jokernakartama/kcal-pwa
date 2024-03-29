import {
  Component,
  createEffect,
  createMemo,
  createSignal,
  on,
  onMount
} from 'solid-js'
import { getJournal, getMeals } from '../../../api'
import { createNavigator } from '../../../hooks/createNavigator'
import { useT } from '../../../i18n'
import { route } from '../../../routes/constants'
import { useStore } from '../../../store'
import { InputChangeEvent } from '../../../types/inputEvents'
import { WithOptional } from '../../../types/utils'
import { calculateMealNutrition } from '../../../utils/data'
import { normalizeDate } from '../../../utils/format'
import { CurrentDate } from '../../informers/CurrentDate/CurrentDate'
import { GoalsSummary } from '../../informers/GoalsSummary'
import { UserBrief } from '../../informers/UserBrief'
import { Container } from '../../layout/Grid'
import { MealList } from '../../lists/MealList'
import { Button } from '../../ui/Button'
import { ButtonPanel } from '../../ui/ButtonPanel/ButtonPanel'
import styles from './styles.sass'

type DashboardComponent = Component

/**
 * Renders main dashboard view
 */
export const Dashboard: DashboardComponent = () => {
  const t = useT()
  const [store, setStore] = useStore()
  const [date, setDate] = createSignal(normalizeDate(new Date()))
  const navigate = createNavigator()
  let selectElement: HTMLSelectElement

  const defaultJournalRecord = createMemo<
  WithOptional<DataModel.JournalRecord, 'id' | 'userId'>
  >(() => ({
    date: date(),
    userId: store.user!.id,
    goals: store.goals!
  }))

  const totals = createMemo(() => {
    const dayMeals: DataModel.Meal[] = store.meals
    const totalValues: DataModel.Nutrition = {
      energy: 0,
      proteins: 0,
      fats: 0,
      carbs: 0
    }

    if (typeof dayMeals !== 'undefined') {
      dayMeals.forEach(meal => {
        const mealNutrition = calculateMealNutrition(meal)

        totalValues.energy += mealNutrition.energy
        totalValues.proteins += mealNutrition.proteins
        totalValues.fats += mealNutrition.fats
        totalValues.carbs += mealNutrition.carbs
      })
    }

    return totalValues
  })

  function fetchJournal() {
    return getJournal(store.user!.id, date())
      .then(data => {
        const nextRecord = data ?? defaultJournalRecord
        setStore('journal', nextRecord)
        return data
      })
      .then((j) => {
        return getMeals(j?.id)
      })
      .then((meals) => {
        setStore('meals', meals.reverse())
      })
  }

  function handleDateChange(nextDate: string) {
    setDate(nextDate)
  }

  function showAddMealDialog() {
    navigate(route.NEW_MEAL)
  }

  function showGoalsDialog() {
    navigate(route.GOALS)
  }

  function goToList(e: InputChangeEvent<HTMLSelectElement>) {
    navigate(e.currentTarget.value)
    e.currentTarget.value = ''
  }

  createEffect(on(date, () => {
    Promise.resolve()
      .then(() => {
        return fetchJournal()
      })
      .catch(console.error)
  }))

  onMount(() => {
    if (selectElement) {
      selectElement.value = ''
    }
  })

  return (
    <>
      <Container class={styles.informers}>
        {/* Brief user info */}
        <UserBrief class="m-mb-2" />

        {/* Day's nutrition goals */}
        <div class={styles.goals}>
          <GoalsSummary
            current={totals()}
            target={store.goals!}
            loading={!store.goals}
            onClick={showGoalsDialog}
          />
        </div>

        {/* Date selector */}
        <CurrentDate class={styles.date} value={date()} onChange={handleDateChange} />
      </Container>

      <Container class={styles.content}>
        {/* List of meals of the day */}
        <MealList />
      </Container>

      <ButtonPanel>
        <Button
          class={styles['options-button']}
          outline
          color="primary"
        >
          ...
          <select ref={el => { selectElement = el }} onInput={goToList}>
            <option value={route.PRODUCTS}>
              {t('products.products')}
            </option>
            <option value={route.RECIPES}>
              {t('recipes.recipes')}
            </option>
          </select>
        </Button>

        <Button half block color="primary" onClick={showAddMealDialog}>
          {t('button.yum')}!
        </Button>
      </ButtonPanel>
    </>
  )
}
