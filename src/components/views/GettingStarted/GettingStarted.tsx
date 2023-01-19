import { Component } from 'solid-js'
import { useT } from '../../../i18n'
import { Button } from '../../ui/Button'
import { ButtonPanel } from '../../ui/ButtonPanel/ButtonPanel'
import { Form } from '../../ui/Form'
import { FormSubmitEvent } from '../../ui/Form/types'
import { GettingStartedFormFields } from './GettingStartedFormFields'
import styles from './styles.sass'

/**
 * Renders the welcome screen
 */
export const GettingStarted: Component = () => {
  const t = useT()

  function handleSubmit(e: FormSubmitEvent) {
    console.warn('sbmitt', e)
  }

  return (
    <Form class={styles.form} autocomplete="off" onSubmit={handleSubmit}>
      <GettingStartedFormFields />

      <ButtonPanel>
        <Button color="accent" type="submit">
          {t('button.start')}!
        </Button>
      </ButtonPanel>
    </Form>
  )
}
