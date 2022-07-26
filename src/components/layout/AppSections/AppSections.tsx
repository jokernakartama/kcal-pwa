import { Component, createSignal, Match, Switch } from 'solid-js'
import { CookBook } from '../../views/CookBook'
import { Dashboard } from '../../views/Dashboard'
import { UserProfile } from '../../views/UserProfile'
import { Container } from '../Grid'
import { TabsPanel } from '../TabsPanel'
import styles from './styles.sass'

export const AppSections: Component = (props) => {
  const [tab, setTab] = createSignal(0)

  return (
    <main class={styles.wrapper}>
      <Container class={styles.content}>
        <div class={styles['tabs-wrapper']}>
          <Switch>
            <Match when={tab() === 0}>
              <Dashboard class={styles.tab} />
            </Match>
            <Match when={tab() === 1}>
              <CookBook class={styles.tab} />
            </Match>
            <Match when={tab() === 2}>
              <UserProfile />
            </Match>
          </Switch>
        </div>
      </Container>

      <TabsPanel onChange={setTab}/>
    </main>
  )
}
