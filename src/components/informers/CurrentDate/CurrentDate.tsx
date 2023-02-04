import classNames from 'classnames'
import { Component, JSX, splitProps } from 'solid-js'
import { addDaysToDate } from '../../../utils/date'
import { normalizeDate } from '../../../utils/format'
import { TextInput } from '../../ui/TextInput'
import { TextInputChangeEvent } from '../../ui/TextInput/types'
import styles from './styles.sass'

type CurrentDateComponent = Component<
Omit<JSX.IntrinsicElements['div'], 'onChange'> & {
  onChange: (date: string) => void
  value: string
}
>

export const CurrentDate: CurrentDateComponent = props => {
  const [local, rest] = splitProps(props, ['onChange', 'class', 'value'])
  const maxDate = normalizeDate(new Date())

  function handleChange(e: TextInputChangeEvent) {
    const nextDate = e.target.value
    if (!nextDate) {
      e.target.value = props.value
      local.onChange(normalizeDate(new Date()))
      return
    }

    local.onChange(nextDate)
  }

  function goNext() {
    const dateObj = addDaysToDate(1, new Date(local.value || ''))

    local.onChange(normalizeDate(dateObj))
  }

  function goPrev() {
    const dateObj = addDaysToDate(-1, new Date(local.value || ''))
    local.onChange(normalizeDate(dateObj))
  }

  return (
    <div class={classNames(local.class, styles.wrapper)} {...rest}>
      <span class={styles.arrow} onClick={goPrev}>
        <svg
          viewBox="0 0 24 24"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs />
          <path d="M 15.717801,3.4926034 8.2797325,11.661871 15.72025,20.507405" />
        </svg>
      </span>

      <TextInput
        class={styles.field}
        icon="pushPin"
        type="date"
        max={maxDate}
        value={local.value}
        onChange={handleChange}
      />

      <span
        class={classNames(styles.arrow, {
          [styles.disabled]: maxDate === local.value
        })}
        onClick={goNext}
      >
        <svg
          viewBox="0 0 24 24"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs />
          <path d="M 8.0004825,3.4926034 15.438551,11.661871 7.9980335,20.507405" />
        </svg>
      </span>
    </div>
  )
}
