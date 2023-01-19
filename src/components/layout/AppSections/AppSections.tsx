import { Component, createEffect, createSignal, Show } from 'solid-js'
import { getJournal, getUserGoals } from '../../../api'
import { useStore } from '../../../store'
import { normalizeDate } from '../../../utils/format'
import { AppLoading } from '../../views/AppLoading'
import { Dashboard } from '../../views/Dashboard'
import { Container } from '../Grid'
import styles from './styles.sass'

/**
 * Renders basic user app and fetches basic user data
 */
export const AppSections: Component = () => {
  const [store, setStore] = useStore()
  const [isReady, setIsReady] = createSignal<boolean>(false)

  function fetchJournalRecord(userId: UserModel.User['id']) {
    return getJournal(userId, normalizeDate(new Date()))
      .then(record => {
        if (typeof record !== 'undefined') {
          setStore({ journal: record })
        }
      })
  }

  function fetchUserGoals(userId: UserModel.User['id']) {
    return getUserGoals(userId)
      .then(goals => {
        if (goals !== undefined) {
          setStore({ goals })
        }
      })
  }

  createEffect(() => {
    if (store.user !== undefined) {
      Promise.all([
        fetchUserGoals(store.user.id),
        fetchJournalRecord(store.user.id)
      ])
        .then(() => {
          setIsReady(true)
        })
        .catch(e => {
          console.error('User data fetching error:', e)
        })
    }
  })

  return (
    <Show when={isReady()} fallback={<AppLoading />}>
      <main class={styles.wrapper}>
        <Container class={styles.content}>
          <Dashboard class={styles.tab} />
        </Container>
      </main>
    </Show>
  )
}
