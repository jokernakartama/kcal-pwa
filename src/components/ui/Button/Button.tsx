import classNames from 'classnames'
import { Component, JSX, splitProps } from 'solid-js'
import styles from './styles.sass'

type ButtonComponent = Component<
JSX.IntrinsicElements['button'] & {
  color: UI.Color
  loading?: boolean
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
    'class',
    'color',
    'block',
    'outline',
    'loading'
  ])

  return (
    <button
      class={classNames(
        styles.wrapper,
        local.class,
        styles[`color-${local.color}`],
        {
          [styles.block]: local.block === true,
          [styles.outline]: local.outline === true
        }
      )}
      disabled={rest.disabled ?? local.loading}
      {...rest}
    >
      {local.children}
    </button>
  )
}
