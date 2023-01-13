import classNames from 'classnames'
import { Component } from 'solid-js'
import { useT } from '../../../../i18n'
import { Container } from '../../../layout/Grid'
import { Button } from '../../../ui/Button'
import { ButtonPanel } from '../../../ui/ButtonPanel/ButtonPanel'
import styles from './styles.sass'

type WelcomeGoalsComponent = Component<{
  class?: string
  onComplete: () => void
  onBack: () => void
}>

export const WelcomeGoals: WelcomeGoalsComponent = (props) => {
  const t = useT()

  return (
    <div class={classNames(styles.wrapper, props.class)}>
      <Container class={styles.content}>
        <div class={styles.headers}>
          <h1 class="m-mb-2 m-mt-2">{t('welcome.goals.header')}</h1>
        </div>

        <div class={styles.fields}>
        </div>

      </Container>
      <ButtonPanel>
        <Button color="secondary" type="button" onClick={props.onBack}>
          {t('button.back')}
        </Button>

        <Button color="accent" type="submit" onClick={props.onComplete}>
          {t('button.start')}!
        </Button>
      </ButtonPanel>
    </div>

  )
}
