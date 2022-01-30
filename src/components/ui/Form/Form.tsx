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
  const [local, rest] = splitProps(props, ['className', 'children', 'disabled'])

  return (
    <form
      className={classNames(styles.wrapper, local.className, {
        [styles.disabled]: local.disabled
      })}
      {...rest}
    >
      {local.children}
    </form>
  )
}
