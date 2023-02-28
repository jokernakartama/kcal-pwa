import classNames from 'classnames'
import { JSX, ParentComponent, splitProps } from 'solid-js'
import styles from './styles.sass'

type ButtonPanelComponent = ParentComponent<
JSX.IntrinsicElements['div'] & {
  justify?: 'start' | 'center' | 'end'
}
>

/**
 * Renders a button wrapper panel
 */
export const ButtonPanel: ButtonPanelComponent = props => {
  const [local, rest] = splitProps(props, ['class', 'children', 'justify'])

  return (
    <div
      class={
        classNames(
          styles.wrapper,
          local.class,
          { [styles[`justify-${local.justify ?? 'end'}`]]: true }
        )
      }
      {...rest}
    >
      {local.children}
    </div>
  )
}
