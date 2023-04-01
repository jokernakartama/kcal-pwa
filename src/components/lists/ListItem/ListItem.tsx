import classNames from 'classnames'
import { createSignal, JSX, ParentComponent, Show, splitProps } from 'solid-js'
import { CancelIcon } from '../../icons/CancelIcon'
import { CheckIcon } from '../../icons/CheckIcon'
import { CrossIcon } from '../../icons/CrossIcon'
import styles from './styles.sass'

export type ListItemComponent<T = object> = ParentComponent<
T &
JSX.IntrinsicElements['div'] &
{
  identifier: DataModel.ID
  onRemove?: (id: DataModel.ID) => void
}>

/**
 * Renders common list item
 */
export const ListItem: ListItemComponent = props => {
  const [isRemoving, setIsRemoving] = createSignal<boolean>(false)
  const [local, rest] = splitProps(props, [
    'children',
    'identifier',
    'class',
    'onRemove'
  ])

  function handleRemove(e: Event) {
    e.stopPropagation()
    setIsRemoving(true)
  }

  function handleCancel(e: Event) {
    e.stopPropagation()
    setIsRemoving(false)
  }

  function handleConfirm(e: Event) {
    e.stopPropagation()
    if (typeof local.onRemove === 'function') {
      local.onRemove(local.identifier)
    }
  }

  return (
    <div class={classNames(styles.wrapper, local.class)} {...rest}>
      <div class={styles.content}>
        {local.children}
      </div>

      <Show when={typeof local.onRemove === 'function'}>
        <div class={styles.buttons}>
          <div
            class={
              classNames(
                styles['controls-group'],
                { [styles.visible]: !isRemoving() }
              )
            }
          >
            <div
              class={classNames(styles.close, styles.control)}
              onClick={handleRemove}
            >
              <CrossIcon />
            </div>
          </div>

          <div
            class={
              classNames(
                styles['controls-group'],
                styles.secondary,
                { [styles.visible]: isRemoving() }
              )
            }
          >
            <div
              class={classNames(styles.cancel, styles.control)}
              onClick={handleCancel}
            >
              <CancelIcon />
            </div>
            <div
              class={classNames(styles.confirm, styles.control)}
              onClick={handleConfirm}
            >
              <CheckIcon />
            </div>
          </div>
        </div>
      </Show>
    </div>
  )
}
