import classNames from 'classnames'
import {
  Component,
  createMemo,
  createSelector,
  For,
  JSX,
  mergeProps,
  splitProps
} from 'solid-js'
import { emoji } from '../../../constants/emoji'
import styles from './styles.sass'
import { SelectOption } from './types'

type SelectInputComponent = Component<
JSX.IntrinsicElements['select'] & {
  /**
     * Allows to specify input data type
     */
  type?: 'text' | 'number' | 'boolean' | 'json'
  placeholder?: string
  options: Array<SelectOption<string | number>>
  icon?: keyof typeof emoji
}
>

/**
 * Renders a select input
 */
export const SelectInput: SelectInputComponent = props => {
  const [local, rest] = splitProps(props, [
    'class',
    'type',
    'options',
    'icon',
    'value'
  ])
  const inputProps = mergeProps({ type: local.type ?? 'text' }, rest)
  const selected = createMemo(() => local.value)
  const isSelected = createSelector(selected)
  const options = createMemo(
    () => local.options.map(o => ({
      ...o,
      value: local.type !== 'text' ? JSON.stringify(o.value) : o.value
    }))
  )

  return (
    <label
      class={classNames(styles.wrapper, local.class, {
        [styles.disabled]: rest.disabled
      })}
    >
      {local.icon !== undefined && (
        <div class={styles.icon}>{emoji[local.icon].html}{' '}</div>
      )}
      <select { ...inputProps}>
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
