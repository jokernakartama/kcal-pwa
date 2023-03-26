import { ParentComponent } from 'solid-js'
import { KeepAliveProvider } from 'solid-keep-alive'
import { Layout } from './components/layout/Layout'
import { I18nProvider } from './i18n'
import { StoreProvider } from './store'
import './styles/style.sass'

export const App: ParentComponent = () => {
  return (
    <I18nProvider>
      <KeepAliveProvider maxElements={1}>
        <StoreProvider>
          <Layout />
        </StoreProvider>
      </KeepAliveProvider>
    </I18nProvider>
  )
}
