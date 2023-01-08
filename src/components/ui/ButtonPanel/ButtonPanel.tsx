import classNames from 'classnames'
import { Component, JSX, splitProps } from 'solid-js'
import styles from './styles.sass'

type ButtonPanelComponent = Component<
  JSX.IntrinsicElements['div'] & { disabled?: boolean }
>

/**
 * Renders a button wrapper panel
 */
export const ButtonPanel: ButtonPanelComponent = props => {
  const [local, rest] = splitProps(props, ['class', 'children'])

  return (
    <div
      class={classNames(styles.wrapper, local.class)}
      {...rest}
    >
      {local.children}
    </div>
  )
}
