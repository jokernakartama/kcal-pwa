import classNames from 'classnames'
import { Component, JSX, splitProps } from 'solid-js'
import styles from './styles.sass'
import { TextInputTypeValue } from './types'

type TextInputComponent = Component<
  JSX.IntrinsicElements['input'] & { type: TextInputTypeValue }
>

/**
 * Renders various input fields
 */
export const TextInput: TextInputComponent = props => {
  const [local, rest] = splitProps(props, ['className'])

  return (
    <input className={classNames(styles.wrapper, local.className)} {...rest} />
  )
}
