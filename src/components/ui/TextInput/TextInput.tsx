import classNames from 'classnames'
import { Component, JSX, splitProps } from 'solid-js'
import styles from './styles.sass'
import { TextInputTypeValue } from './types'

type TextInputComponent = Component<
  JSX.IntrinsicElements['input'] & {
    type: TextInputTypeValue
    icon?: string
  }
>

/**
 * Renders various input fields
 */
export const TextInput: TextInputComponent = props => {
  const [local, rest] = splitProps(props, ['className', 'icon'])

  return (
    <label className={classNames(styles.wrapper, local.className)}>
      {local.icon !== undefined && (
        <div className={styles.icon}>{local.icon}</div>
      )}
      <input {...rest} />
      <div className={styles.placeholder}>{rest.placeholder}</div>
    </label>
  )
}
