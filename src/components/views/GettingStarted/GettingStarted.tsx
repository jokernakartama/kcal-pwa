import { Component } from 'solid-js'
import { setUser, setUserGoals, setUserInfo } from '../../../api'
import { useT } from '../../../i18n'
import { useStore } from '../../../store'
import { Button } from '../../ui/Button'
import { ButtonPanel } from '../../ui/ButtonPanel/ButtonPanel'
import { Form, getFormValues } from '../../ui/Form'
import { FormSubmitEvent } from '../../ui/Form/types'
import { GettingStartedFormFields } from './GettingStartedFormFields'
import styles from './styles.sass'
import { GettingStartedForm } from './types'

/**
 * Renders the welcome screen
 */
export const GettingStarted: Component = () => {
  const t = useT()
  const [, setStore] = useStore()

  function saveUser(form: GettingStartedForm): Promise<UserModel.User> {
    return setUser({
      name: form.name,
      sex: form.sex,
      birthDate: form.birthDate
    })
      .then((user) => {
        return user
      })
  }

  function saveGoals(
    userId: UserModel.User['id'],
    form: GettingStartedForm
  ): Promise<UserModel.Goals> {
    return setUserGoals({
      userId,
      energy: form.energy,
      proteins: Math.round(form.proteins),
      fats: Math.round(form.fats),
      carbs: Math.round(form.carbs)
    })
  }

  function saveUserInfo(
    userId: UserModel.User['id'],
    form: GettingStartedForm
  ): Promise<UserModel.Info> {
    return setUserInfo({
      userId,
      nutrientsRatio: form.ratio
    })
  }

  function handleSubmit(e: FormSubmitEvent) {
    e.preventDefault()
    const values = getFormValues<GettingStartedForm>(e.currentTarget)
    let user: UserModel.User | undefined

    saveUser(values)
      .then((u) => {
        user = u
        return saveGoals(user.id, values)
      })
      .then((goals) => {
        return saveUserInfo(goals.userId, values)
      })
      .then(() => {
        setStore({ user })
      })
      .catch(err => {
        console.warn(err)
      })

  }

  return (
    <Form class={styles.form} autocomplete="off" onSubmit={handleSubmit}>
      <GettingStartedFormFields />

      <ButtonPanel>
        <Button half block color="accent" type="submit">
          {t('button.start')}!
        </Button>
      </ButtonPanel>
    </Form>
  )
}
