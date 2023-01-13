import { Route, Routes } from '@solidjs/router'
import { Component, createEffect, createSignal, onMount, Show } from 'solid-js'
import { getJournal, getUserGoals, getUsers } from '../../../api'
import { i18n } from '../../../i18n/config'
import { useStore } from '../../../store'
import { normalizeDate } from '../../../utils/format'
import { AppLoading } from '../../views/AppLoading'
import { GettingStarted } from '../../views/GettingStarted'
// import { GettingStarted } from '../../views/GettingStarted'
import { AppSections } from '../AppSections'
import styles from './styles.sass'

export const Layout: Component = () => {
  const [store, setStore] = useStore()
  const [isReady, setIsReady] = createSignal(false)

  function applyLanguage() {
    return i18n
  }

  function fetchUser() {
    return getUsers()
      .then(users => {

        if (users.length > 0) {
          setStore({ user: users[0] })
        }
      })
  }

  function fetchJournalRecord(userId: UserModel.User['id']) {
    getJournal(userId, normalizeDate(new Date()))
      .then(record => {
        if (typeof record !== 'undefined') {
          setStore({ journal: record })
        }
      })
      .catch(e => {
        console.error('Journal fetching error: ', e)
      })
  }

  function fetchUserGoals(userId: UserModel.User['id']) {
    getUserGoals(userId)
      .then(goals => {
        if (goals !== undefined) {
          setStore({ goals })
        }
      })
      .catch(e => {
        console.error('Goals fetching error: ', e)
      })
  }

  onMount(() => {
    Promise.all([
      fetchUser(),
      applyLanguage()
    ])
      .then(() => {
        setIsReady(true)
      })
      .catch(e => {
        console.error('App starting error:', e)
      })

  })

  createEffect(() => {
    if (store.user !== undefined) {
      fetchUserGoals(store.user.id)
      fetchJournalRecord(store.user.id)
    }
  })

  return (
    <div class={styles.wrapper}>
      <Show when={isReady()} fallback={<AppLoading />}>
        <Show
          when={store.user !== undefined}
          fallback={<GettingStarted />}
        >
          <Routes>
            <Route path="/" component={AppSections} />
            <Route path="/start" component={GettingStarted} />
          </Routes>
        </Show>
      </Show>
    </div>
  )
}
