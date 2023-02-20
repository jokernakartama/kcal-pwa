import classNames from 'classnames'
import { Component, JSX, splitProps } from 'solid-js'
import { addDaysToDate } from '../../../utils/date'
import { normalizeDate } from '../../../utils/format'
import { BackIcon } from '../../icons/BackIcon'
import { ForthIcon } from '../../icons/ForthIcon'
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
        <BackIcon />
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
        <ForthIcon />
      </span>
    </div>
  )
}
