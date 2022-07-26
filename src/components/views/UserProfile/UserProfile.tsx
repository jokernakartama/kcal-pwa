import { Component } from 'solid-js'
import { useStore } from '../../../store'
import styles from './styles.sass'

export const UserProfile: Component = (props) => {
  const [store] = useStore()

  return (
    <div class={styles.wrapper}>
      <pre>
        {JSON.stringify(store.user, null, '  ')}
      </pre>

      <pre>
        {JSON.stringify(store.goals, null, '  ')}
      </pre>
    </div>
  )
}
