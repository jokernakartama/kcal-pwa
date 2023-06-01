import { Component, createSignal } from 'solid-js'
import { setUserGoals, setUserInfo } from '../../../api'
import { createNavigator } from '../../../hooks/createNavigator'
import { useT } from '../../../i18n'
import { endpoint } from '../../../routes/constants'
import { useProfile, useStore } from '../../../store'
import { Container } from '../../layout/Grid'
import { Button } from '../../ui/Button'
import { ButtonPanel } from '../../ui/ButtonPanel/ButtonPanel'
import { Dialog } from '../../ui/Dialog'
import { Form, getFormValues } from '../../ui/Form'
import { FormSubmitEvent } from '../../ui/Form/types'
import { GoalsViewFormFields } from './GoalsViewFormFields'
import styles from './styles.sass'
import { GoalsViewFormValues } from './types'

/**
 * Shows a dialog to update user goals
 */
export const GoalsView: Component = () => {
  const [, setStore] = useStore()
  const [isLoading, setIsLoading] = createSignal<boolean>(false)
  const t = useT()
  const user = useProfile()
  const navigate = createNavigator()

  function closeDialog() {
    navigate(endpoint.HOME, -1)
  }

  function saveGoals(
    form: GoalsViewFormValues
  ) {
    return setUserGoals({
      userId: user.id,
      energy: form.energy,
      proteins: Math.round(form.proteins),
      fats: Math.round(form.fats),
      carbs: Math.round(form.carbs)
    })
      .then(goals => {
        setStore('goals', goals)
      })
  }

  function saveUserInfo(
    form: GoalsViewFormValues
  ) {
    return setUserInfo({
      userId: user.id,
      nutrientsRatio: form.ratio
    })
      .then(info => {
        setStore('info', info)
      })
  }

  function handleSubmit(e: FormSubmitEvent) {
    e.preventDefault()

    const values = getFormValues<GoalsViewFormValues>(e.currentTarget)

    setIsLoading(true)

    Promise.all([
      saveGoals(values),
      saveUserInfo(values)
    ])
      .catch(err => {
        console.warn(err)
      })
      .finally(() => {
        closeDialog()
        setIsLoading(false)
      })
  }

  return (
    <Form autocomplete="off" onSubmit={handleSubmit}>
      <Dialog
        class={styles.wrapper}
        onClose={closeDialog}
        onBack={closeDialog}
        header={<h2>{t('goals.header')}</h2>}
        footer={
          <>
            <ButtonPanel>
              <Button
                type="button"
                disabled={isLoading()}
                color="secondary"
                onClick={closeDialog}
              >
                {t('button.back')}
              </Button>
              <Button
                half block
                color="primary"
                loading={isLoading()}
                type="submit"
              >
                {t('button.save')}
              </Button>
            </ButtonPanel>
          </>
        }
      >
        <Container class={styles.content}>
          <GoalsViewFormFields />
        </Container>
      </Dialog>
    </Form>
  )
}
