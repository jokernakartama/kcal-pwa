import { Component, createSignal, onMount, Show } from 'solid-js'
import { Layout } from './components/layout/Layout'
import { DBWorkerProvider } from './db'
import { I18nProvider } from './i18n'
import { i18n } from './i18n/config'
import { StoreProvider } from './store'
import './styles/style.sass'

export const App: Component = () => {
  const [isReady, setIsReady] = createSignal(false)

  onMount(() => {
    i18n
      .then(() => {
        setIsReady(true)
      })
      .catch(error => {
        console.error(error)
      })
  })

  return (
    <Show when={isReady()}>
      <DBWorkerProvider>
        <I18nProvider>
          <StoreProvider>
            <Layout />
          </StoreProvider>
        </I18nProvider>
      </DBWorkerProvider>
    </Show>
  )
}
