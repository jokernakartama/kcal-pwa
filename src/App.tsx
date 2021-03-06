import { Component } from 'solid-js'
import { Layout } from './components/layout/Layout'
import { I18nProvider } from './i18n'
import { StoreProvider } from './store'
import './styles/style.sass'

export const App: Component = () => {
  return (
    <I18nProvider>
      <StoreProvider>
        <Layout />
      </StoreProvider>
    </I18nProvider>
  )
}
