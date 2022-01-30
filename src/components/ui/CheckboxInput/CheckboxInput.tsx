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
  const [local, rest] = splitProps(props, ['className', 'children'])

  return (
    <label
      className={classNames(styles.wrapper, local.className, {
        [styles.disabled]: rest.disabled
      })}
    >
      <input type="checkbox" {...rest} />
      <div className={styles.switch}></div>
      <span className={styles.label}>{local.children}</span>
    </label>
  )
}
