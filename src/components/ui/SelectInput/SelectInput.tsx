import classNames from 'classnames'
import { Component, For, JSX, splitProps } from 'solid-js'
import styles from './styles.sass'

type SelectInputComponent = Component<
  JSX.IntrinsicElements['select'] & {
    placeholder?: string
    options: Array<{ value?: string | number; label: string }>
    icon?: string
  }
>

/**
 * Renders a select input
 */
export const SelectInput: SelectInputComponent = props => {
  const [local, rest] = splitProps(props, ['className', 'options', 'icon'])

  return (
    <label className={classNames(styles.wrapper, local.className)}>
      {local.icon !== undefined && (
        <div className={styles.icon}>{local.icon}</div>
      )}
      <select {...rest}>
        <For each={local.options}>
          {o => <option value={o.value}>{o.label}</option>}
        </For>
      </select>
      <div className={styles.placeholder}>{rest.placeholder}</div>
    </label>
  )
}
