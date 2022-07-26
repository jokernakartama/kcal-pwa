import classNames from 'classnames'
import {
  Component,
  createMemo,
  createSelector,
  For,
  JSX,
  splitProps
} from 'solid-js'
import styles from './styles.sass'
import { SelectOption } from './types'

type SelectInputComponent = Component<
  JSX.IntrinsicElements['select'] & {
    placeholder?: string
    options: Array<SelectOption<string | number>>
    icon?: string
  }
>

/**
 * Renders a select input
 */
export const SelectInput: SelectInputComponent = props => {
  const [local, rest] = splitProps(props, [
    'class',
    'options',
    'icon',
    'value'
  ])
  const selected = createMemo(() => local.value)
  const isSelected = createSelector(selected)
  const options = createMemo(
    () => local.options.map(o => ({ ...o, value: JSON.stringify(o.value) }))
  )

  return (
    <label
      class={classNames(styles.wrapper, local.class, {
        [styles.disabled]: rest.disabled
      })}
    >
      {local.icon !== undefined && (
        <div class={styles.icon}>{local.icon}</div>
      )}
      <select {...rest}>
        <For each={options()}>
          {o => (
            <option
              value={o.value}
              selected={isSelected(o.value)}
              disabled={o.disabled}
            >
              {o.label}
            </option>
          )}
        </For>
      </select>
      <div class={styles.placeholder}>{rest.placeholder}</div>
    </label>
  )
}
