import classNames from 'classnames'
import { For, Component, JSX, splitProps, createSignal, createSelector } from 'solid-js'
import { emoji } from '../../../constants/emoji'
import { InputChangeEvent } from '../../../types/inputEvents'
import styles from './styles.sass'

type CardRadioInputComponent = Component<
Omit<JSX.IntrinsicElements['input'], 'type'> & {
  options: Array<{
    value?: string | number
    label: JSX.Element
    disabled?: boolean
    icon?: keyof typeof emoji
  }>
}
>

/**
 * Renders a checkbox field
 */
export const CardRadioInput: CardRadioInputComponent = props => {
  const [local, rest] = splitProps(props, [
    'class',
    'children',
    'options',
    'value',
    'onChange'
  ])
  const [selected, setSelected] = createSignal(local.value)
  const isSelected = createSelector(selected)

  function handleChange(e: InputChangeEvent) {

    setSelected(e.currentTarget.value)
    if (typeof local.onChange === 'function') {
      local.onChange(e)
    }
  }

  return (
  //   <label
  //   class={classNames(styles.wrapper, local.class, {
  //     [styles.disabled]: rest.disabled
  //   })}
  // >
  //   <input type="radio" {...rest} />
  //   <div class={styles.switch}></div>
  //   {local.icon !== undefined &&
  //   <span class={styles.icon}>
  //     {emoji[local.icon].html}
  //   </span>
  //   }

  //   <span class={styles.label}>
  //     {local.children}
  //   </span>
  // </label>
    <For each={local.options}>
      {o => (
        <label
          class={classNames(styles.wrapper, local.class, {
            [styles.disabled]: o.disabled
          })}
        >
          <input
            type="radio"
            checked={isSelected(o.value)}
            value={o.value}
            disabled={o.disabled}
            {...rest}
            onChange={handleChange}
          />
          <div class={styles.switch}></div>

          {o.icon !== undefined &&
            <span class={styles.icon}>
              {emoji[o.icon].html}
            </span>
          }

          <span class={styles.label}>{o.label}</span>
        </label>
      )}
    </For>
  )
}
