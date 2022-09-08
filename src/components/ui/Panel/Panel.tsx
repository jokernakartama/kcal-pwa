import classNames from 'classnames'
import { createMemo, ParentComponent } from 'solid-js'
import { Portal } from 'solid-js/web'
import styles from './styles.sass'

type PanelComponent<T = any> = ParentComponent<{
  when: T | undefined | null | false
  keepalive?: boolean
}>

/**
 * Renders a panel
 */
export const Panel: PanelComponent = (props) => {
  const isOpen = createMemo(() => !!props.when )
  const children = createMemo(() => {
    if (props.keepalive === true || isOpen()) {
      return props.children
    }

    return null
  })

  return (
    <Portal mount={window.document.body}>
      <div
        class={styles.wrapper}
      >
        <div
          class={classNames(styles.dialog, { [styles.open]: isOpen() })}
        >
          <div class={styles.top}>
            top
          </div>
          <div class={styles.children}>
            {children()}
          </div>
        </div>
      </div>
    </Portal>
  )
}
