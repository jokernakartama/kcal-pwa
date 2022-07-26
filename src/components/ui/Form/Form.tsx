import classNames from 'classnames'
import { Component, JSX, splitProps } from 'solid-js'
import styles from './styles.sass'

type FormComponent = Component<
  JSX.IntrinsicElements['form'] & { disabled?: boolean }
>

/**
 * Renders a form component
 */
export const Form: FormComponent = props => {
  const [local, rest] = splitProps(props, ['class', 'children', 'disabled'])

  return (
    <form
      class={classNames(styles.wrapper, local.class, {
        [styles.disabled]: local.disabled
      })}
      {...rest}
    >
      {local.children}
    </form>
  )
}
