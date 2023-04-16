import { ParentComponent } from 'solid-js'
import { Layout } from './components/layout/Layout'
import { EventBusProvider } from './components/providers/EventBus'
import { I18nProvider } from './i18n'
import { StoreProvider } from './store'
import './styles/style.sass'

export const App: ParentComponent = () => {
  return (
    <I18nProvider>
      <EventBusProvider>
        <StoreProvider>
          <Layout />
        </StoreProvider>
      </EventBusProvider>
    </I18nProvider>
  )
}
