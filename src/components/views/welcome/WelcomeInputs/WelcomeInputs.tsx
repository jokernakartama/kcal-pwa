import classNames from 'classnames'
import { Component, createMemo } from 'solid-js'
import { emoji } from '../../../../constants/emoji'
import { useT } from '../../../../i18n'
import { Col, Container, Row } from '../../../layout/Grid'
import { Button } from '../../../ui/Button'
import { ButtonPanel } from '../../../ui/ButtonPanel/ButtonPanel'
import { useForm } from '../../../ui/Form'
import { SelectInput } from '../../../ui/SelectInput'
import { SelectOption } from '../../../ui/SelectInput/types'
import { TextInput } from '../../../ui/TextInput'
import { GettingStartedFormFields } from '../../GettingStarted/types'
import styles from './styles.sass'

type WelcomePersonalComponent = Component<{
  class?: string
  onComplete: () => void
  onBack: () => void
}>

export const WelcomeInputs: WelcomePersonalComponent = (props) => {
  const t = useT()
  const { fields } = useForm<GettingStartedFormFields>()
  const isValid = createMemo(() => {
    return fields.height?.valid && fields.weight?.valid && fields.activity?.valid
  })

  const activityOptions = createMemo<
    Array<SelectOption<UserModel.Info['activity']>>
  >(() => [
    {
      label: `${emoji.personInLotusPosition.string} ${t(
        'profile.activity_min'
      )}`,
      value: 1.2
    },
    {
      label: `${emoji.personDoingCartwheel.string} ${t(
        'profile.activity_low'
      )}`,
      value: 1.375
    },
    {
      label: `${emoji.runner.string} ${t('profile.activity_avg')}`,
      value: 1.46
    },
    {
      label: `${emoji.bicyclist.string} ${t('profile.activity_intense')}`,
      value: 1.55
    },
    {
      label: `${emoji.rowboat.string} ${t('profile.activity_high')}`,
      value: 1.64
    },
    {
      label: `${emoji.personClimbing.string} ${t('profile.activity_veryhigh')}`,
      value: 1.72
    },
    {
      label: `${emoji.weightLifter.string} ${t('profile.activity_max')}`,
      value: 1.9
    }
  ])

  return (
    <div class={classNames(styles.wrapper, props.class)}>
      <Container class={styles.content}>
        <div class={styles.headers}>
          <h1 class="m-mb-2 m-mt-2">{t('welcome.inputs.header')}</h1>
        </div>

        <div class={styles.fields}>

          <Row>
            <Col mobile="6" class="m-mb-2">
              <TextInput
                required
                pattern="^1$"
                type="number"
                icon="scales"
                placeholder={t('profile.weight')}
                name="weight"
                min="30"
                max="200"
              />
            </Col>
            <Col mobile="6" class="m-mb-2">
              <TextInput
                required
                pattern="^1$"
                type="number"
                icon="straightRuler"
                placeholder={t('profile.height')}
                name="height"
                min="50"
                max="300"
              />
            </Col>
          </Row>
          <Row >
            <Col class="m-mb-2">
              <SelectInput
                required
                name="activity"
                placeholder={t('profile.activity')}
                value={activityOptions()[2].value}
                options={activityOptions()}
              />
            </Col>
          </Row>

          <Row>
            <Col>
              {fields.activity?.value === 1.2 && t('activity.min')}
              {fields.activity?.value === 1.375 && t('activity.low')}
              {fields.activity?.value === 1.46 && t('activity.avg')}
              {fields.activity?.value === 1.55 && t('activity.intense')}
              {fields.activity?.value === 1.64 && t('activity.high')}
              {fields.activity?.value === 1.72 && t('activity.veryhigh')}
              {fields.activity?.value === 1.9 && t('activity.max')}
            </Col>
          </Row>
        </div>
      </Container>
      <ButtonPanel>
        <Button color="secondary" type="button" onClick={props.onBack}>
          {t('button.back')}
        </Button>
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
