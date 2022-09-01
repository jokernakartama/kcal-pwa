import classNames from 'classnames'
import {
  Component,
  createMemo,
  createResource,
  createSignal,
  For
} from 'solid-js'
import { getJournal, getMeals } from '../../../api'
import { emoji } from '../../../constants/emoji'
import { useStore } from '../../../store'
import { WithOptional } from '../../../types/utils'
import { normalizeDate } from '../../../utils/format'
// import { FilterPanel } from '../../layout/FilterPanel'
// import { TextInput } from '../../ui/TextInput'
// import { TextInputChangeEvent } from '../../ui/TextInput/types'
import styles from './styles.sass'

type DashboardComponent = Component<{
  class?: string
}>

export const Dashboard: DashboardComponent = (props) => {
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
  const [meals] = createResource(journalId, fetchMeals)
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
        totalValues.kcalories += meal.product?.kcalories ?? 0
        totalValues.proteins += meal.product?.proteins ?? 0
        totalValues.fats += meal.product?.fats ?? 0
        totalValues.carbohydrates += meal.product?.carbohydrates ?? 0
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
        {/* JOURNAL RECORD
        <pre>
          {JSON.stringify(journal(), null, '  ')}
        </pre> */}
        TODAY'S GOALS

        <div>
          {emoji.highVoltage.html}: {totals().kcalories} / {store.goals?.kcalories} kkal<br />
          {emoji.poultryLeg.html}: {totals().proteins} / {store.goals?.proteins} g<br />
          {emoji.avocado.html}: {totals().fats} / {store.goals?.fats} g<br />
          {emoji.cookedRice.html}: {totals().carbohydrates} / {store.goals?.carbohydrates} g
        </div>
        <br /><br />

        TODAY'S MEALS

        <For each={meals()?.items} fallback={<div>Loading...</div>}>
          {item => (
            <div class={styles.meal}>
              <div>
                {item.product?.name ?? item.recipe?.name}{' - '}
                <b>{item.mass} g</b>
              </div>
              <div>
                <small>
                  E: {item.product?.kcalories} kkal
                  P: {item.product?.proteins} g
                  F: {item.product?.fats} g
                  C: {item.product?.carbohydrates} g
                </small>
              </div>
            </div>
          )}
        </For>
      </div>
    </>
  )
}
