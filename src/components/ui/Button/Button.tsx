import classNames from 'classnames'
import { Component, JSX, splitProps } from 'solid-js'
import styles from './styles.sass'

type ButtonComponent = Component<
  JSX.IntrinsicElements['button'] & {
    color: UI.Color
    outline?: boolean
    block?: boolean
  }
>

/**
 * Renders a button
 */
export const Button: ButtonComponent = props => {
  const [local, rest] = splitProps(props, [
    'children',
    'className',
    'color',
    'block',
    'outline'
  ])

  return (
    <button
      className={classNames(
        styles.wrapper,
        local.className,
        styles[`color-${local.color}`],
        {
          [styles.block]: local.block === true,
          [styles.outline]: local.outline === true
        }
      )}
      {...rest}
    >
      {local.children}
    </button>
  )
}
