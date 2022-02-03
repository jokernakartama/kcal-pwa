import { Component, Show } from 'solid-js'
import { useStore } from '../../../store'
import { GettingStarted } from '../../views/GettingStarted'
import styles from './styles.sass'

export const Layout: Component = () => {
  const [state] = useStore()

  return (
    <div className={styles.wrapper}>
      <Show when={state.user !== undefined} fallback={<GettingStarted />}>
        <pre>{JSON.stringify(state, null, 2)}</pre>
      </Show>
    </div>
  )
}
