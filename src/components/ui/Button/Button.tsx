import classNames from 'classnames'
import { Component, JSX, splitProps } from 'solid-js'
import styles from './styles.sass'

type ButtonComponent = Component<
JSX.IntrinsicElements['button'] & {
  color: UI.Color
  loading?: boolean
  outline?: boolean
  block?: boolean
  half?: boolean
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
    'half',
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
          [styles.block]: local.block,
          [styles.half]: local.half,
          [styles.outline]: local.outline
        }
      )}
      disabled={rest.disabled ?? local.loading}
      type={rest.type || 'button'}
      {...rest}
    >
      {local.children}
    </button>
  )
}
