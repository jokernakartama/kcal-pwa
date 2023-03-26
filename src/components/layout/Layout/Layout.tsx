import { useRoutes } from '@solidjs/router'
import { Component, createSignal, onMount, Show } from 'solid-js'
import { getUsers } from '../../../api'
import { i18n } from '../../../i18n/config'
import { routes } from '../../../routes'
import { useStore } from '../../../store'
import { AppLoading } from '../../views/AppLoading'
import { GettingStarted } from '../../views/GettingStarted'
import styles from './styles.sass'

/**
 * Fetches initial data and renders the basic view
 */
export const Layout: Component = () => {
  const [store, setStore] = useStore()
  const [isReady, setIsReady] = createSignal<boolean>(false)
  const Routes = useRoutes(routes)

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

  return (
    <div class={styles.wrapper}>
      <Show when={isReady()} fallback={<AppLoading />}>
        <Show
          when={store.user !== undefined}
          fallback={<GettingStarted />}
        >
          <Routes />
        </Show>
      </Show>
    </div>
  )
}
