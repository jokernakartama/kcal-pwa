import classNames from 'classnames'
import { Component, JSX, splitProps } from 'solid-js'
import { emoji } from '../../../constants/emoji'
import styles from './styles.sass'
import { TextInputTypeValue } from './types'

type TextInputComponent = Component<
  JSX.IntrinsicElements['input'] & {
    type: TextInputTypeValue
    icon?: keyof typeof emoji
  }
>

/**
 * Renders various input fields
 */
export const TextInput: TextInputComponent = props => {
  const [local, rest] = splitProps(props, ['class', 'icon'])

  return (
    <label
      class={classNames(styles.wrapper, local.class, {
        [styles.disabled]: rest.disabled
      })}
    >
      {local.icon !== undefined && (
        <div class={styles.icon}>
          {emoji[local.icon].html}{' '}
        </div>
      )}
      <input {...rest} />
      <div class={styles.placeholder}>{rest.placeholder}</div>
    </label>
  )
}
