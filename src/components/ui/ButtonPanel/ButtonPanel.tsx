import classNames from 'classnames'
import { JSX, ParentComponent, splitProps } from 'solid-js'
import styles from './styles.sass'

type ButtonPanelComponent = ParentComponent<
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
