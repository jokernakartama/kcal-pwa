import classNames from 'classnames'
import { Component, createEffect, createMemo, Index, JSX, on, splitProps } from 'solid-js'
import { createStore, produce } from 'solid-js/store'
import { RatioInputPart } from './RatioInputPart'
import styles from './styles.sass'
import { RatioOption } from './types'

type RatioInputComponent = Component<
  Omit<JSX.IntrinsicElements['input'], 'type'> & {
    /**
     * Minimal value of a ratio
     */
    min?: number
    parts: RatioOption[]
  }
>

interface PartsStore {
  value: number[]
}

/**
 * Renders a parts input
 */
export const RatioInput: RatioInputComponent = props => {
  let inputElement: HTMLInputElement
  const [local, rest] = splitProps(props, [
    'class',
    'children',
    'parts',
    'min',
    'onChange'
  ])
  const [state, setState] = createStore<PartsStore>({
    value: local.parts.map(ratio => ratio.defaultValue)
  })
  const min = createMemo(() => {
    return local.min ?? 0.01
  })
  const inputValue = createMemo(() => {
    return JSON.stringify(state.value)
  })

  function getNextValue(index: number, value: number, dir: -1 | 1) {
    if (
      (dir === -1 && index === 0) ||
      (dir === 1) && index === local.parts.length - 1
    ) return state.value[index]

    const minValue = min()
    const maxValue = state.value[index + dir] + state.value[index] - minValue

    return Math.max(Math.min(value, maxValue), minValue)
  }

  function handleChange(
    e: InputEvent & { currentTarget: HTMLInputElement; target: Element }
  ) {
    if (typeof local.onChange === 'function') {
      local.onChange(e)
    }
  }

  function handlePartChange(index: number, value: number, dir: -1 | 1) {
    const sideIndex = index + dir
    const offset = value - state.value[index]

    const nextValue = getNextValue(index, value, dir)
    const sideValue = getNextValue(
      sideIndex,
      state.value[sideIndex] - offset,
      -dir as typeof dir
    )

    setState(
      produce((s) => {
        s.value![index] = nextValue
        s.value![sideIndex] = sideValue
      })
    )
  }

  createEffect(on(inputValue, () => {
    if (inputElement?.form) {
      const e = new Event('custom-input')

      inputElement.form.dispatchEvent(e)
    }
  }))

  return (
    <div class={classNames(styles.wrapper, local.class)}>
      <div class={styles.input}>
        <div class={styles['ranges-wrapper']}>
          <Index each={local.parts}>
            {(item, index) => {
              const part = item()

              return (
                <RatioInputPart
                  value={state.value[index] ?? 0}
                  color={part.color}
                  label={part.label}
                  onChange={(v, d) => handlePartChange(index, v, d)}
                />
              )
            }}
          </Index>
        </div>

        <input
          ref={(el) => { inputElement = el }}
          type="hidden"
          {...rest}
          value={inputValue()}
          onChange={handleChange}
        />
      </div>
    </div>

  )
}
