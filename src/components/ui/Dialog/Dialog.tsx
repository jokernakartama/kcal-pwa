import classNames from 'classnames'
import { JSX, ParentComponent, Show, splitProps } from 'solid-js'
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

/**
 * Renders dialog layout
 */
export const Dialog: DialogComponent = props => {
  const [local, rest] = splitProps(
    props,
    ['class', 'children', 'header', 'footer', 'onClose', 'onBack']
  )

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

  return (
    <>
      <div class={styles.backdrop}></div>

      <div
        class={classNames(styles.wrapper, local.class)}
        {...rest}
      >
        <div class={styles.window}>
          <div class={styles.header}>
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
