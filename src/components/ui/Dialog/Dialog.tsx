import classNames from 'classnames'
import { JSX, ParentComponent, Show, splitProps } from 'solid-js'
import styles from './styles.sass'

type DialogComponent = ParentComponent<
JSX.IntrinsicElements['div'] & {
  header?: JSX.Element
  footer?: JSX.Element
  onClose?: () => void
}
>

/**
 * Renders dialog layout
 */
export const Dialog: DialogComponent = props => {
  const [local, rest] = splitProps(
    props,
    ['class', 'children', 'header', 'footer', 'onClose']
  )

  function handleClose() {
    if (typeof local.onClose === 'function') {
      local.onClose()
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
            <span class={styles.back} onClick={handleClose}>
              <svg
                viewBox="0 0 24 24"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs />
                <path d="M 15.717801,3.4926034 8.2797325,11.661871 15.72025,20.507405" />
              </svg>
            </span>
            {local.header}

            <span class={styles.close} onClick={handleClose}>
              <svg
                viewBox="0 0 24 24"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs />
                <path d="M 19.810106,4.1856511 4.1898939,19.814349" />
                <path d="M 19.814349,19.810106 4.1856514,4.1898935" />
              </svg>
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
