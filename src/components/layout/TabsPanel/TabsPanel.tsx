import classNames from 'classnames'
import { Component, createSignal } from 'solid-js'
import { emoji } from '../../../constants/emoji'
import styles from './styles.sass'

type TabsPanelComponent = Component<{
  class?: string
  onChange: (index: number) => void
}>

export const TabsPanel: TabsPanelComponent = (props) => {
  const [tab, setTab] = createSignal(0)

  function changeTab(index: number) {
    setTab(index)
    props.onChange(index)
  }

  return (
    <div class={classNames(styles.wrapper, props.class)}>
      <button
        class={
          classNames(styles.tab, styles.tab_dashboard, {
            [styles.tab_active]: tab() === 0
          })
        }
        type="button"
        onClick={() => changeTab(0)}
      >
        {emoji.barChart.html}
      </button>
      <button
        class={
          classNames(styles.tab, styles.tab_dashboard, {
            [styles.tab_active]: tab() === 1
          })
        }
        type="button"
        onClick={() => changeTab(1)}
      >
        {emoji.forkAndKnife.html}
      </button>
      <button
        class={
          classNames(styles.tab, styles.tab_dashboard, {
            [styles.tab_active]: tab() === 2
          })
        }
        type="button"
        onClick={() => changeTab(2)}
      >
        {emoji.bustInSilhouette.html}
      </button>
    </div>
  )
}
