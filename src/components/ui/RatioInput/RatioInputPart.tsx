import classNames from 'classnames'
import { createEffect, createMemo, on, ParentComponent, Show } from 'solid-js'
import { createMovementCapture } from '../../../hooks/createMovementCapture'
import { roundTo } from '../../../utils/format'
import styles from './styles.sass'

type RatioInputPartComponent = ParentComponent<{
  value: number
  color?: UI.OriginalColorName
  label?: string
  onChange: (nextValue: number, dir: -1 | 1) => void
}>

/**
 * Renders a part of ratio
 */
export const RatioInputPart: RatioInputPartComponent = props => {
  let elementRef: HTMLDivElement | undefined
  let capturedValue = props.value

  const displayValue = createMemo(() => Math.round(props.value * 100))
  const { hold: onRightHold, touch: onRightTouch, x: rightX } = createMovementCapture()
  const { hold: onLeftHold, touch: onLeftTouch, x: leftX } = createMovementCapture()

  function handleRightHold(e: Parameters<typeof onRightHold>['0']) {
    capturedValue = props.value
    onRightHold(e)
  }

  function handleRightTouch(e: Parameters<typeof onRightTouch>['0']) {
    capturedValue = props.value
    onRightTouch(e)
  }

  function handleLeftHold(e: Parameters<typeof onLeftHold>['0']) {
    capturedValue = props.value
    onLeftHold(e)
  }

  function handleLeftTouch(e: Parameters<typeof onLeftTouch>['0']) {
    capturedValue = props.value
    onLeftTouch(e)
  }

  function changeRatio(offset?: number, reversed = false) {
    if (!elementRef || !offset) return 0

    const parentWidth = (elementRef.parentElement as HTMLDivElement).clientWidth
    const sign = reversed ? -1 : 1
    const offsetRatio = capturedValue + (sign * offset / parentWidth)

    return roundTo(offsetRatio, 2)
  }

  function handleDragStart(e: DragEvent) {
    e.preventDefault()
  }

  createEffect(on(rightX, (v) => {
    const rX = v ?? 0

    if (rX !== 0) {
      const ratio = changeRatio(rX)
      props.onChange(ratio, 1)
    }
  }, { defer: true }))

  createEffect(on(leftX, (v) => {
    const lX = v ?? 0

    if (lX !== 0) {
      const ratio = changeRatio(lX, true)
      props.onChange(ratio, -1)
    }
  }, { defer: true }))

  return (
    <div
      ref={elementRef}
      class={styles.range}
      style={{ 'flex-basis': `${displayValue()}%` }}
      onDragStart={handleDragStart}
    >

      <Show when={props.label}>
        <div class={styles.label}>
          {props.label}
        </div>
      </Show>

      <div class={styles['range-value']}>
        {displayValue()}%
      </div>

      <div
        class={
          classNames(
            styles['range-bar'],
            { [styles[`color-${props.color ?? ''}`]]: !!props.color }
          )
        }
      />

      <div class={styles.controls}>
        <div
          class={styles['control-button']}
          onMouseDown={handleLeftHold}
          onTouchStart={handleLeftTouch}
        />
        <div
          class={styles['control-button']}
          onMouseDown={handleRightHold}
          onTouchStart={handleRightTouch}
        />
      </div>
    </div>
  )
}
