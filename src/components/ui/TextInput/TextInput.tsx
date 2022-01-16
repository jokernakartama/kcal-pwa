import classNames from 'classnames'
import { Component, JSX } from 'solid-js'
import styles from './styles.sass'
import { TextInputTypeValue } from './types'

type TextInputComponent = Component<
  JSX.IntrinsicElements['input'] & { type: TextInputTypeValue }
>

/**
 * Renders various input fields
 */
export const TextInput: TextInputComponent = ({ className, ...rest }) => {
  return <input className={classNames(styles.wrapper, className)} {...rest} />
}
