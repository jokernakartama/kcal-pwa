import classNames from 'classnames'
import { Component, JSX, splitProps } from 'solid-js'
import styles from './styles.sass'

type ButtonComponent = Component<JSX.IntrinsicElements['button']>

/**
 * Renders a button
 */
export const Button: ButtonComponent = props => {
  const [local, ...rest] = splitProps(props, ['children', 'className'])

  return (
    <button className={classNames(styles.wrapper, local.className)} {...rest}>
      {local.children}
    </button>
  )
}
