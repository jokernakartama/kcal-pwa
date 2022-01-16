import classNames from 'classnames'
import { Component, JSX } from 'solid-js'
import styles from './styles.sass'

type RadioInputComponent = Component<
  Omit<JSX.IntrinsicElements['input'], 'type'>
>

/**
 * Renders a radio button
 */
export const RadioInput: RadioInputComponent = ({ className, ...rest }) => {
  return (
    <input
      type="radio"
      className={classNames(styles.wrapper, className)}
      {...rest}
    />
  )
}
