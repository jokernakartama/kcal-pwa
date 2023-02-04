import classNames from 'classnames'
import { Component, createMemo, JSX, Show, splitProps } from 'solid-js'
import { Loader } from '../../ui/Loader'
import styles from './styles.sass'

type GoalsSummaryComponent = Component<JSX.IntrinsicElements['span'] & {
  current: number
  target: number
  loading?: boolean
}>

/**
 * Renders a pair of current/target values
 */
export const GoalsSummaryValue: GoalsSummaryComponent = (props) => {
  const [local, rest] = splitProps(props, [
    'class', 'current', 'target', 'loading'
  ])

  const isOverflown = createMemo(() => {
    return local.current > local.target * 1.07
  })
  const isAchieved = createMemo(() => {
    return local.current > local.target * 0.93 && !isOverflown()
  })

  return (
    <span class={classNames(styles['value-wrapper'], local.class)} {...rest}>
      <Show when={!local.loading} fallback={<Loader class={styles.skeleton} />}>
        <span class={classNames(
          styles['value-current'],
          {
            [styles['value-over']]: isOverflown(),
            [styles['value-done']]: isAchieved()
          }
        )}>
          {local.current}
        </span>
        <span class={styles['value-target']}> / {local.target}</span>
      </Show>
    </span>
  )
}
