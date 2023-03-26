import classNames from 'classnames'
import { Component, JSX, Show, splitProps } from 'solid-js'
import { emoji } from '../../../constants/emoji'
import { CrossIcon } from '../../icons/CrossIcon'
import styles from './styles.sass'
import { TextInputChangeEvent, TextInputTypeValue } from './types'

type TextInputComponent = Component<
JSX.IntrinsicElements['input'] & {
  type: TextInputTypeValue
  icon?: keyof typeof emoji
  /**
   * Whether a button to clear the input should be visible.
   * This action DOESN'T dispatch a fully identical to
   * the original "input" event. The complete list of changes:
   * - currentTarget: null
   * - bubbles: false
   * - explicitOriginalTarget is an HTMLDivElement
   *   instead of the original input element
   * - isTrusted: false
   * - view: null
   * - data: "" (empty string)
   * - ...and some specific to synthetic events properties
   *
   * In case when you need original event subscribe
   * to the "change" event instead
   */
  clearable?: boolean
}
>

/**
 * Renders various input fields
 */
export const TextInput: TextInputComponent = props => {
  const [local, rest] = splitProps(props, ['class', 'icon', 'clearable'])
  let inputElement: HTMLInputElement

  function handleClear() {
    if (inputElement) {
      inputElement.value = ''

      if (typeof props.onInput === 'function') {
        const evt = new InputEvent('input', { data: '', inputType: 'insertText' })

        inputElement.dispatchEvent(evt)

        props.onInput(evt as TextInputChangeEvent)
      }
    }
  }

  return (
    <label
      class={classNames(styles.wrapper, local.class, {
        [styles.disabled]: rest.disabled,
        [styles.clearable]: local.clearable
      })}
    >
      {local.icon !== undefined && (
        <div class={styles.icon}>
          {emoji[local.icon].html}{' '}
        </div>
      )}
      <input ref={el => { inputElement = el }} {...rest} />
      <div class={styles.placeholder}>{rest.placeholder}</div>

      <Show when={local.clearable}>
        <div class={styles.clear} onClick={handleClear}>
          <CrossIcon />
        </div>
      </Show>
    </label>
  )
}
