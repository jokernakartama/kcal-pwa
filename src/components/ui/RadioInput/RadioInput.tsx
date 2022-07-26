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

type RadioInputComponent = Component<
  Omit<JSX.IntrinsicElements['input'], 'type'> & {
    options: Array<{
      value?: string | number
      label: JSX.Element
      disabled?: boolean
    }>
  }
>

/**
 * Renders a set of radio buttons
 */
export const RadioInput: RadioInputComponent = props => {
  const [local, rest] = splitProps(props, [
    'class',
    'children',
    'options',
    'value'
  ])
  const selected = createMemo(() => local.value)
  const isSelected = createSelector(selected)

  return (
    <For each={local.options}>
      {o => (
        <label
          class={classNames(styles.wrapper, local.class, {
            [styles.disabled]: o.disabled
          })}
        >
          <input
            type="radio"
            checked={isSelected(o.value)}
            value={o.value}
            disabled={o.disabled}
            {...rest}
          />
          <div class={styles.switch}></div>
          <span class={styles.label}>{o.label}</span>
        </label>
      )}
    </For>
  )
}
