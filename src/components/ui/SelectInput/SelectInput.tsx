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

type SelectInputComponent = Component<
  JSX.IntrinsicElements['select'] & {
    placeholder?: string
    options: Array<{
      value?: string | number
      label: string
      disabled?: boolean
    }>
    icon?: string
  }
>

/**
 * Renders a select input
 */
export const SelectInput: SelectInputComponent = props => {
  const [local, rest] = splitProps(props, [
    'className',
    'options',
    'icon',
    'value'
  ])
  const selected = createMemo(() => local.value)
  const isSelected = createSelector(selected)

  return (
    <label
      className={classNames(styles.wrapper, local.className, {
        [styles.disabled]: rest.disabled
      })}
    >
      {local.icon !== undefined && (
        <div className={styles.icon}>{local.icon}</div>
      )}
      <select {...rest}>
        <For each={local.options}>
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
      <div className={styles.placeholder}>{rest.placeholder}</div>
    </label>
  )
}
