import classNames from 'classnames'
import { Component, createMemo } from 'solid-js'
import { useT } from '../../../../i18n'
import { addYearsToDate } from '../../../../utils/date'
import { normalizeDate } from '../../../../utils/format'
import { Col, Container, Row } from '../../../layout/Grid'
import { Button } from '../../../ui/Button'
import { ButtonPanel } from '../../../ui/ButtonPanel/ButtonPanel'
import { CardRadioInput } from '../../../ui/CardRadioInput'
import { useForm } from '../../../ui/Form'
import { SelectOption } from '../../../ui/SelectInput/types'
import { TextInput } from '../../../ui/TextInput'
import { GettingStartedFormFields } from '../../GettingStarted/types'
import styles from './styles.sass'

type WelcomePersonalComponent = Component<{
  class?: string
  onComplete: () => void
  // onBack: () => void
}>

export const WelcomePersonal: WelcomePersonalComponent = (props) => {
  const { fields } = useForm<GettingStartedFormFields>()
  const isValid = createMemo(() => {
    return fields.name?.valid && fields.birthDate?.valid && fields.sex?.valid
  })
  const maxDate: string = normalizeDate(addYearsToDate(-16))

  const t = useT()
  const sexOptions = createMemo<
    Array<SelectOption<UserModel.Info['sex']>>
  >(
    () => [
      { label: `${t('profile.male')}`, value: 'male', icon: 'man' },
      { label: `${t('profile.female')}`, value: 'female', icon: 'woman' }
    ]
  )

  return (
    <div class={classNames(styles.wrapper, props.class)}>
      <Container class={styles.content}>
        <div class={styles.headers}>
          <h1 class="m-mb-2 m-mt-2">{t('welcome.personal.header')}</h1>
        </div>

        <div class={styles.fields}>
          <Row class="m-mb-4">
            <Col desktop="4" class="m-mb-2">
              <TextInput
                required
                type="text"
                placeholder={t('profile.name')}
                icon="bustInSilhouette"
                name="name"
              />
            </Col>
            <Col mobile="12" desktop="4" class="m-mb-2">
              <TextInput
                required
                type="date"
                icon="birthday"
                placeholder={t('profile.birthday')}
                name="birthDate"
                min="1900-01-01"
                max={maxDate}
              />
            </Col>
          </Row>

          <Row>
            <Col mobile="12" desktop="4" class="m-mb-3">
              <div class={styles['cards-wrapper']}>
                <CardRadioInput
                  class={styles.card}
                  name="sex"
                  options={sexOptions()}
                  value={sexOptions()[0].value}
                />
              </div>
            </Col>
          </Row>
        </div>
      </Container>

      <ButtonPanel>
        <Button
          disabled={!isValid()}
          color="primary"
          type="button"
          onClick={props.onComplete}
        >
          {t('button.continue')}
        </Button>
      </ButtonPanel>
    </div>
  )
}
