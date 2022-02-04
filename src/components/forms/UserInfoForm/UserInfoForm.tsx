import { Component, createMemo } from 'solid-js'
import { emoji } from '../../../constants/emoji'
import { useT } from '../../../i18n'
import { Col, Row } from '../../layout/Grid'
import { Button } from '../../ui/Button'
import { Form, getFormValues } from '../../ui/Form'
import { FormSubmitEvent } from '../../ui/Form/types'
import { SelectInput } from '../../ui/SelectInput'
import { SelectOption } from '../../ui/SelectInput/types'
import { TextInput } from '../../ui/TextInput'

type UserInfoFormComponent = Component<{
  defaults?: UserModel.Info
  onSubmit: (values?: UserModel.Info) => void
}>

export const UserInfoForm: UserInfoFormComponent = props => {
  const t = useT()
  const sexOptions = createMemo<Array<SelectOption<UserModel.Info['sex']>>>(
    () => [
      { label: `${emoji.man.string} ${t('profile.male')}`, value: 'male' },
      { label: `${emoji.woman.string} ${t('profile.female')}`, value: 'female' }
    ]
  )
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
  const goalOptions = createMemo<Array<SelectOption<UserModel.Info['goal']>>>(
    () => [
      {
        label: `${emoji.pinchingHand.string} ${t('profile.lose')}`,
        value: -0.15
      },
      { label: `${emoji.like.string} ${t('profile.keep')}`, value: 0 },
      {
        label: `${emoji.flexedBiceps.string} ${t('profile.gain')}`,
        value: 0.15
      }
    ]
  )

  function handleSubmit(e: FormSubmitEvent) {
    e.preventDefault()
    props.onSubmit(getFormValues<UserModel.Info>(e))
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col desktop="4" className="m-mb-2">
          <TextInput
            type="text"
            placeholder={t('profile.name')}
            icon={'\uD83D\uDC64'}
            name="name"
          />
        </Col>
        <Col mobile="6" desktop="4" className="m-mb-2">
          <TextInput
            type="date"
            icon={'\uD83C\uDF82 '}
            placeholder={t('profile.birthday')}
            name="birthDate"
          />
        </Col>
        <Col mobile="6" desktop="4" className="m-mb-2">
          <SelectInput
            name="sex"
            // icon={'\uD83D\uDC95 '}
            placeholder={t('profile.sex')}
            value={sexOptions()[0].value}
            options={sexOptions()}
          />
        </Col>
      </Row>

      <Row>
        <Col mobile="6" className="m-mb-2">
          <TextInput
            required
            pattern="^1$"
            type="number"
            icon={'\u2696 '}
            placeholder={t('profile.weight')}
            name="weight"
          />
        </Col>
        <Col mobile="6" className="m-mb-2">
          <TextInput
            type="number"
            icon={'\uD83D\uDCCF'}
            placeholder={t('profile.height')}
            name="height"
          />
        </Col>
      </Row>
      <Row className="m-mb-6">
        <Col desktop="6" className="m-mb-2">
          <SelectInput
            name="activity"
            placeholder={t('profile.activity')}
            value={activityOptions()[2].value}
            options={activityOptions()}
          />
        </Col>
        <Col desktop="6" className="m-mb-2">
          <SelectInput
            name="goal"
            placeholder={t('profile.goal')}
            value={goalOptions()[1].value}
            options={goalOptions()}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <Button block color="primary" type="submit">
            {t('button.continue')}
          </Button>
        </Col>
      </Row>
    </Form>
  )
}
