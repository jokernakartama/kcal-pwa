import classNames from 'classnames'
import {
  Component,
  createMemo,
  createResource,
  createSignal
} from 'solid-js'
import { getJournal } from '../../../api'
import { useStore } from '../../../store'
import { WithOptional } from '../../../types/utils'
import { normalizeDate } from '../../../utils/format'
import { FilterPanel } from '../../layout/FilterPanel'
import { TextInput } from '../../ui/TextInput'
import { TextInputChangeEvent } from '../../ui/TextInput/types'
import styles from './styles.sass'

type DashboardComponent = Component<{
  class?: string
}>

export const Dashboard: DashboardComponent = (props) => {
  const [store] = useStore()
  const [date, setDate] = createSignal(normalizeDate(new Date()))

  const defaultJournalRecord = createMemo<
    WithOptional<DataModel.JournalRecord, 'id' | 'userId'>
  >(() => ({
    date: date(),
    userId: store.user!.id
  }))
  const [journal] = createResource(store.user, fetchJournal)

  function fetchJournal() {
    return getJournal(store.user!.id, date())
      .then(data => data ?? defaultJournalRecord())
  }

  function handleDateChange(e: TextInputChangeEvent) {
    if (e.currentTarget.value !== undefined) {
      setDate(e.currentTarget.value)
    }
  }

  return (
    <>
      <FilterPanel>
        <TextInput
          type="date"
          value={date()}
          onChange={handleDateChange}
        />
      </FilterPanel>

      <div class={classNames(props.class, styles.wrapper)}>
        <pre>
          {JSON.stringify(journal(), null, '  ')}
        </pre>
      </div>
    </>
  )
}
