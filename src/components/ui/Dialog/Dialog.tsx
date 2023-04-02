import classNames from 'classnames'
import { createEffect, createMemo, JSX, ParentComponent, Show, splitProps } from 'solid-js'
import { createMovementCapture } from '../../../hooks/createMovementCapture'
import { BackIcon } from '../../icons/BackIcon'
import { CrossIcon } from '../../icons/CrossIcon'
import styles from './styles.sass'

type DialogComponent = ParentComponent<
JSX.IntrinsicElements['div'] & {
  header?: JSX.Element
  footer?: JSX.Element
  onClose?: () => void
  onBack?: () => void
}
>

const TRESHOLD = .7

/**
 * Renders dialog layout
 */
export const Dialog: DialogComponent = props => {
  let dialogElement: HTMLDivElement | undefined
  const { isCaptured, touch, y } = createMovementCapture({ x: false })
  const [local, rest] = splitProps(
    props,
    ['class', 'children', 'header', 'footer', 'onClose', 'onBack']
  )
  const dialogStyle = createMemo(() => {
    return isCaptured()
      ? { transform: `translateY(${Math.max(y()!, 0)}px)` }
      : undefined
  })

  function handleClose() {
    if (typeof local.onClose === 'function') {
      local.onClose()
    }
  }

  function handleBack() {
    if (typeof local.onBack === 'function') {
      local.onBack()
    }
  }

  createEffect(() => {
    const yValue = y()

    if (
      typeof yValue !== 'undefined' &&
      typeof props.onClose === 'function' &&
      !isCaptured() &&
      yValue > (dialogElement?.clientHeight ?? 0) * TRESHOLD
    ) {
      handleClose()
    }
  })

  return (
    <>
      <div class={styles.backdrop}></div>

      <div
        ref={el => { dialogElement = el }}
        class={classNames(styles.wrapper, local.class)}
        {...rest}
      >
        <div
          class={classNames(styles.window, { [styles.captured]: isCaptured() })}
          style={dialogStyle()}
        >
          <div class={styles.header} onTouchStart={touch}>
            <span class={styles.back} onClick={handleBack}>
              <BackIcon />
            </span>
            {local.header}

            <span class={styles.close} onClick={handleClose}>
              <CrossIcon />
            </span>
          </div>

          <div class={styles.content}>
            {local.children}
          </div>

          <Show when={props.footer}>
            <div class={styles.footer}>
              {local.footer}
            </div>
          </Show>
        </div>
      </div>
    </>
  )
}
