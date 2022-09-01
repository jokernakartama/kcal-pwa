import { Component, createMemo, createSignal } from 'solid-js'
import { emoji } from '../../../constants/emoji'
// import { emoji } from '../../../constants/emoji'
import { useT } from '../../../i18n'
import { getNutrientAmount } from '../../../utils/calculations'
import { Col, Row } from '../../layout/Grid'
import { Button } from '../../ui/Button'
import { Form, getFormValues } from '../../ui/Form'
import { FormSubmitEvent } from '../../ui/Form/types'
import { TextInput } from '../../ui/TextInput'
import { TextInputChangeEvent } from '../../ui/TextInput/types'

type FormValues = Pick<DataModel.Meal, 'mass'>

type MealFormComponent = Component<{
  product: DataModel.Product
  onSubmit: (values?: FormValues) => void
}>

export const MealForm: MealFormComponent = props => {
  const t = useT()
  const [mass, setMass] = createSignal<number>(100)
  const energy = createMemo(() => {
    return getNutrientAmount(props.product.kcalories, mass())
  })
  const proteins = createMemo(() => {
    return getNutrientAmount(props.product.proteins, mass())
  })
  const fats = createMemo(() => {
    return getNutrientAmount(props.product.fats, mass())
  })
  const carbohydrates = createMemo(() => {
    return getNutrientAmount(props.product.carbohydrates, mass())
  })

  function handleMassChange(e: TextInputChangeEvent) {
    setMass(+e.currentTarget.value)
  }

  function handleSubmit(e: FormSubmitEvent) {
    e.preventDefault()
    props.onSubmit(getFormValues<FormValues>(e))
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col mobile="6" desktop="4" class="m-mb-2">
          <TextInput
            type="number"
            icon={emoji.scales.string}
            placeholder={`${t('mass')}, ${t('unit.gram')}`}
            name="mass"
            min="0"
            value={mass()}
            onInput={handleMassChange}
          />
        </Col>

        <Col mobile="6" desktop="4" class="m-mb-2">
          {emoji.highVoltage.html}: {energy()} kkal<br />
          {emoji.poultryLeg.html}: {proteins()} g<br />
          {emoji.avocado.html}: {fats()} g<br />
          {emoji.cookedRice.html}: {carbohydrates()} g
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
