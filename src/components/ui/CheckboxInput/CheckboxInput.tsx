import classNames from 'classnames'
import { Component, JSX, splitProps } from 'solid-js'
import styles from './styles.sass'

type CheckboxInputComponent = Component<
Omit<JSX.IntrinsicElements['input'], 'type'>
>

/**
 * Renders a checkbox field
 */
export const CheckboxInput: CheckboxInputComponent = props => {
  const [local, rest] = splitProps(props, ['class', 'children'])

  return (
    <label
      class={classNames(styles.wrapper, local.class, {
        [styles.disabled]: rest.disabled
      })}
    >
      <input type="checkbox" {...rest} />
      <div class={styles.switch}></div>
      <span class={styles.label}>{local.children}</span>
    </label>
  )
}
