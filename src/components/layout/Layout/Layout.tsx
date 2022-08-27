import { Component, createEffect, createSignal, onMount, Show } from 'solid-js'
import { getUserGoals, getUsers } from '../../../api'
import { i18n } from '../../../i18n/config'
import { useStore } from '../../../store'
import { GettingStarted } from '../../views/GettingStarted'
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

  function fetchUserGoals(userId: UserModel.Info['id']) {
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
    }
  })

  return (
    <div class={styles.wrapper}>
      <Show when={isReady()} fallback={<h1>LOadiNg...</h1>}>
        <Show
          when={store.user !== undefined}
          fallback={<GettingStarted />}
        >
          <AppSections />
        </Show>
      </Show>
    </div>
  )
}
