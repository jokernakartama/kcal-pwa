import classNames from 'classnames'
import { Component, JSX, splitProps } from 'solid-js'
import styles from './styles.sass'

type TextareaComponent = Component<
JSX.IntrinsicElements['textarea'] & {
  placeholder?: string
}
>

/**
 * Renders textarea
 */
export const Textarea: TextareaComponent = props => {
  const [local, rest] = splitProps(props, ['class'])

  return (
    <label
      class={classNames(styles.wrapper, local.class, {
        [styles.disabled]: rest.disabled
      })}
    >
      <textarea {...rest} />
      <div class={styles.placeholder}>{rest.placeholder}</div>
    </label>
  )
}
