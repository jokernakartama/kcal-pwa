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
    'className',
    'children',
    'options',
    'value'
  ])
  const selected = createMemo(() => local.value)
  const isSelected = createSelector(selected)

  return (
    <For each={local.options}>
      {o => (
        <label className={classNames(styles.wrapper, local.className)}>
          <input
            type="radio"
            checked={isSelected(o.value)}
            value={o.value}
            disabled={o.disabled}
            {...rest}
          />
          <div className={styles.switch}></div>
          <span className={styles.label}>{o.label}</span>
        </label>
      )}
    </For>
  )
}
