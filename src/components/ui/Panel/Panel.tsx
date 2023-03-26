import classNames from 'classnames'
import { createEffect, createMemo, createSignal, ParentComponent } from 'solid-js'
import { Portal } from 'solid-js/web'
import { createMovementCapture } from '../../../hooks/createMovementCapture'
import styles from './styles.sass'

type PanelComponent<T = any> = ParentComponent<{
  when: T | undefined | null | false
  /**
   * Whether the content of the panel should be
   * mounted after the panel is closed
   */
  keepalive?: boolean
  /**
   * A value between 0 and 1 defines what part of the panel should be moved
   * down to call `onClose`
   */
  closeTreshold?: number
  onClose?: () => void
}>

/**
 * Renders a panel
 */
export const Panel: PanelComponent = props => {
  let dialogElement: HTMLDivElement | undefined
  const { isCaptured, hold, touch, y } = createMovementCapture({ x: false })
  const treshold = props.closeTreshold ?? 0.5
  const dialogStyle = createMemo(() => {
    return isCaptured()
      ? { transform: `translateY(${Math.max(y()!, 0)}px)` }
      : undefined
  })

  const [isHidden, setIsHidden] = createSignal<boolean>(!props.when)
  const isOpen = createMemo(() => !!props.when )
  const children = createMemo(() => {
    if (props.keepalive === true || !isHidden()) {
      return props.children
    }

    return null
  })

  function handleTransitionEnd(e: TransitionEvent) {
    if (!isOpen()) setIsHidden(true)
  }

  createEffect(() => {
    if (isOpen()) setIsHidden(false)
  })

  createEffect(() => {
    const yValue = y()

    if (
      typeof yValue !== 'undefined' &&
      typeof props.onClose === 'function' &&
      !isCaptured() &&
      yValue > (dialogElement?.clientHeight ?? 0) * treshold
    ) {
      props.onClose()
    }
  })

  return (
    <Portal mount={window.document.body}>
      <div
        class={classNames(styles.wrapper, {
          [styles.captured]: isCaptured()
        })}
      >
        <div
          ref={el => { dialogElement = el }}
          class={classNames(styles.dialog, {
            [styles.open]: isOpen(),
            [styles.captured]: isCaptured()
          })}
          style={dialogStyle()}
          onTransitionEnd={handleTransitionEnd}
        >
          <div
            class={styles.top}
            onMouseDown={hold}
            onTouchStart={touch}
          >
            ...
          </div>
          <div class={styles.children}>
            {children()}
          </div>
        </div>
      </div>
    </Portal>
  )
}
