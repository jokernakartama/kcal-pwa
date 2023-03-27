import { useNavigate } from '@solidjs/router'
import {
  Component,
  createEffect,
  createMemo,
  createSignal,
  on
} from 'solid-js'
import { getJournal, getMeals } from '../../../api'
import { useT } from '../../../i18n'
import { route } from '../../../routes/constants'
import { useStore } from '../../../store'
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
  const navigate = useNavigate()

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

  createEffect(on(date, () => {
    Promise.resolve()
      .then(() => {
        return fetchJournal()
      })
      .catch(console.error)
  }))

  return (
    <>
      <Container class={styles.content}>
        {/* Brief user info */}
        <UserBrief class="m-mb-2" />

        <div class={styles.informers}>
          {/* Day's nutrition goals */}
          <GoalsSummary
            current={totals()}
            target={store.goals!}
            loading={!store.goals}
          />

          {/* Date selector */}
          <CurrentDate class={styles.date} value={date()} onChange={handleDateChange} />
        </div>

        {/* List of meals of the day */}
        <MealList />
      </Container>

      <ButtonPanel>
        {/* <Button
          class={styles['options-button']}
          outline
          color="primary"
          type="button"
        >
          ...
        </Button> */}
        <Button half block color="primary" type="button" onClick={showAddMealDialog}>
          {t('button.yum')}!
        </Button>
      </ButtonPanel>
    </>
  )
}
