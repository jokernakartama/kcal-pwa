import classNames from 'classnames'
import { Component, JSX, splitProps } from 'solid-js'
import styles from './styles.sass'

type LoaderComponent = Component<
JSX.IntrinsicElements['span'] & {
  block?: boolean
}
>

/**
 * Renders animated content replacement
 */
export const Loader: LoaderComponent = props => {
  const [local, rest] = splitProps(props, ['block', 'class'])

  return (
    <span
      class={classNames(styles.wrapper, local.class, { [styles.block]: local.block })}
      {...rest}
    />
  )
}
