import { Component } from 'solid-js'
import { emoji } from '../../../constants/emoji'
// import { emoji } from '../../../constants/emoji'
import { useT } from '../../../i18n'
import { Col, Row } from '../../layout/Grid'
import { Button } from '../../ui/Button'
import { Form, getFormValues } from '../../ui/Form'
import { FormSubmitEvent } from '../../ui/Form/types'
import { TextInput } from '../../ui/TextInput'

type NutrientsFormComponent = Component<{
  defaults?: UserModel.Goals
  onSubmit: (values?: UserModel.Goals) => void
}>

export const NutrientsForm: NutrientsFormComponent = props => {
  const t = useT()

  function handleSubmit(e: FormSubmitEvent) {
    e.preventDefault()
    props.onSubmit(getFormValues<UserModel.Goals>(e))
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col desktop="4" class="m-mb-2">
          <TextInput
            required
            type="number"
            icon={emoji.highVoltage.string}
            placeholder={`${t('nutrients.kcalories')}, ${t('unit.kcal')}`}
            name="kcalories"
            min="0"
          />
        </Col>
        <Col desktop="4" class="m-mb-2">
          <TextInput
            type="number"
            icon={emoji.poultryLeg.string}
            placeholder={`${t('nutrients.proteins')}, ${t('unit.gram')}`}
            name="proteins"
            min="0"
          />
        </Col>
        <Col desktop="4" class="m-mb-2">
          <TextInput
            required
            type="number"
            icon={emoji.avocado.string}
            placeholder={`${t('nutrients.fats')}, ${t('unit.gram')}`}
            name="fats"
            min="0"
          />
        </Col>
        <Col desktop="4" class="m-mb-2">
          <TextInput
            type="number"
            icon={emoji.cookedRice.string}
            placeholder={`${t('nutrients.carbohydrates')}, ${t('unit.gram')}`}
            name="carbohydrates"
            min="0"
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
