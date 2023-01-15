import classNames from 'classnames'
import { createEffect, createMemo, createSignal, ParentComponent } from 'solid-js'
import { Portal } from 'solid-js/web'
import styles from './styles.sass'

type PanelComponent<T = any> = ParentComponent<{
  when: T | undefined | null | false
  keepalive?: boolean
  onClose?: () => void
}>

/**
 * Renders a panel
 */
export const Panel: PanelComponent = (props) => {
  let headerRef: HTMLDivElement | undefined
  const [capturedY, setCapturedY] = createSignal<number | undefined>()
  const [currentY, setCurrentY] = createSignal<number | undefined>()
  const dialogStyle = createMemo(() => {
    return capturedY()
      ? { transform: `translateY(${currentY()!}px)` }
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

  function hold(e: MouseEvent) {
    setCapturedY(e.pageY - (headerRef?.offsetTop ?? 0))
    window.document.addEventListener('mousemove', move)
    window.document.addEventListener('mouseup', release)
  }

  function touch(e: TouchEvent) {
    if (!e.touches[0]) return

    const { pageY } = e.touches[0]
    setCapturedY(pageY - (headerRef?.offsetTop ?? 0))

    window.document.addEventListener('touchmove', slide)
    window.document.addEventListener('touchend', release)
  }

  function slide(e: TouchEvent) {
    if (!e.touches[0]) return

    const { pageY } = e.touches[0]
    const topMax = window.document.documentElement.clientHeight - 80
    const topValue = pageY - (capturedY() ?? 0)
    setCurrentY(
      topValue >= 0
        ? (topValue > topMax ? topMax : topValue)
        : 0
    )
  }

  function move(e: MouseEvent) {
    const my = e.pageY
    const topMax = window.document.documentElement.clientHeight - 80
    const topValue = my - (capturedY() ?? 0)
    setCurrentY(
      topValue >= 0
        ? (topValue > topMax ? topMax : topValue)
        : 0
    )
  }

  function release() {
    window.document.removeEventListener('mouseup', release)
    window.document.removeEventListener('mousemove', move)
    window.document.removeEventListener('touchend', release)
    window.document.removeEventListener('touchmove', slide)

    setCapturedY(undefined)
    setCurrentY(undefined)
  }

  createEffect(() => {
    if (isOpen()) setIsHidden(false)
  })

  return (
    <Portal mount={window.document.body}>
      <div
        class={classNames(styles.wrapper, {
          [styles.captured]: typeof capturedY() !== 'undefined'
        })}
      >
        <div
          class={classNames(styles.dialog, {
            [styles.open]: isOpen(),
            [styles.captured]: typeof capturedY() !== 'undefined'
          })}
          style={dialogStyle()}
          onTransitionEnd={handleTransitionEnd}
        >
          <div
            ref={headerRef}
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
