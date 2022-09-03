import classNames from 'classnames'
import {
  Component,
  createMemo,
  createResource,
  createSignal,
  For
} from 'solid-js'
import { getJournal, getMeals, removeMeal } from '../../../api'
import { emoji } from '../../../constants/emoji'
import { useT } from '../../../i18n'
import { useStore } from '../../../store'
import { WithOptional } from '../../../types/utils'
import { getNutrientAmount } from '../../../utils/calculations'
import { normalizeDate } from '../../../utils/format'
// import { FilterPanel } from '../../layout/FilterPanel'
// import { TextInput } from '../../ui/TextInput'
// import { TextInputChangeEvent } from '../../ui/TextInput/types'
import styles from './styles.sass'

type DashboardComponent = Component<{
  class?: string
}>

export const Dashboard: DashboardComponent = (props) => {
  const t = useT()
  const [store] = useStore()
  const [date] = createSignal(normalizeDate(new Date()))

  const defaultJournalRecord = createMemo<
    WithOptional<DataModel.JournalRecord, 'id' | 'userId'>
  >(() => ({
    date: date(),
    userId: store.user!.id
  }))
  const [journal] = createResource(store.user, fetchJournal)
  const journalId = createMemo(() => journal()?.id)
  const [meals, { refetch }] = createResource(journalId, fetchMeals)
  const totals = createMemo(() => {
    const dayMeals = meals()?.items
    const totalValues = {
      kcalories: 0,
      proteins: 0,
      fats: 0,
      carbohydrates: 0
    }

    if (typeof dayMeals !== 'undefined') {
      dayMeals.forEach(meal => {
        totalValues.kcalories += meal.product !== undefined ? getNutrientAmount(meal.product.kcalories, meal.mass) : 0
        totalValues.proteins += meal.product !== undefined ? getNutrientAmount(meal.product.proteins, meal.mass) : 0
        totalValues.fats += meal.product !== undefined ? getNutrientAmount(meal.product.fats, meal.mass) : 0
        totalValues.carbohydrates += meal.product !== undefined ? getNutrientAmount(meal.product.carbohydrates, meal.mass) : 0
      })
    }

    return totalValues
  })

  function fetchJournal() {
    return getJournal(store.user!.id, date())
      .then(data => data ?? defaultJournalRecord())
  }

  function fetchMeals() {
    return getMeals(journalId()!)
      .then(data => {
        return data
      })
  }

  function deleteMeal(mealId: DataModel.Meal['id']) {
    removeMeal(mealId)
      .then(() => {
        return refetch()
      })
      .catch(console.error)
  }

  // function handleDateChange(e: TextInputChangeEvent) {
  //   if (e.currentTarget.value !== undefined) {
  //     setDate(e.currentTarget.value)
  //   }
  // }

  return (
    <>
      {/* <FilterPanel>
        <TextInput
          type="date"
          value={date()}
          onChange={handleDateChange}
        />
      </FilterPanel> */}

      <div class={classNames(props.class, styles.wrapper)}>

        TODAY'S GOALS

        <div>
          {emoji.highVoltage.html}: {Math.round(totals().kcalories)} / {store.goals?.kcalories} kkal<br />
          {emoji.poultryLeg.html}: {Math.round(totals().proteins)} / {store.goals?.proteins} g<br />
          {emoji.avocado.html}: {Math.round(totals().fats)} / {store.goals?.fats} g<br />
          {emoji.cookedRice.html}: {Math.round(totals().carbohydrates)} / {store.goals?.carbohydrates} g
        </div>
        <br /><br />

        TODAY'S MEALS

        <For each={meals()?.items} fallback={<div>Loading...</div>}>
          {item => (
            <div class={styles.meal}>
              <div class={styles.title}>
                {item.product?.name ?? item.recipe?.name}{' - '}
                <b>{item.mass} g</b>
                <button onClick={() => deleteMeal(item.id)}> X </button>
              </div>
              <div>
                <small>
                  {t('nutrients.E')}:{' '}
                  {getNutrientAmount(item.product?.kcalories ?? 0, item.mass)}{' '}
                  {t('unit.kcal')}{' | '}
                  {t('nutrients.P')}:{' '}
                  {getNutrientAmount(item.product?.proteins ?? 0, item.mass)}{' '}
                  {t('unit.gram')}{' | '}
                  {t('nutrients.F')}:{' '}
                  {getNutrientAmount(item.product?.fats ?? 0, item.mass)}{' '}
                  {t('unit.gram')}{' | '}
                  {t('nutrients.C')}:{' '}
                  {getNutrientAmount(item.product?.carbohydrates ?? 0, item.mass)}{' '}
                  {t('unit.gram')}
                </small>
              </div>
            </div>
          )}
        </For>
      </div>
    </>
  )
}
