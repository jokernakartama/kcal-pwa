import { Component } from 'solid-js'
import { useT } from '../../../i18n'
import { Col, Row } from '../../layout/Grid'
import { TextInput } from '../../ui/TextInput'

export type ProductFormValues = Omit<DataModel.Product, 'id' | 'userId'>

type ProductFormComponent = Component

/**
 * Doesn't render a <Form />
 * Renders product form fields.
 */
export const ProductForm: ProductFormComponent = () => {
  const t = useT()

  return (
    <>
      <Row>
        <Col desktop="8" class="m-mb-2">
          <TextInput
            required
            type="text"
            icon="forkAndKnife"
            placeholder={t('product.name')}
            name="name"
            min="0"
          />
        </Col>
        <Col desktop="4" class="m-mb-2">
          <TextInput
            required
            type="number"
            icon="highVoltage"
            placeholder={`${t('nutrients.energy')}, ${t('unit.kcal')}`}
            name="energy"
            min="0"
          />
        </Col>
        <Col desktop="4" class="m-mb-2">
          <TextInput
            type="number"
            icon="poultryLeg"
            placeholder={`${t('nutrients.proteins')}, ${t('unit.gram')}`}
            name="proteins"
            min="0"
          />
        </Col>
        <Col desktop="4" class="m-mb-2">
          <TextInput
            required
            type="number"
            icon="avocado"
            placeholder={`${t('nutrients.fats')}, ${t('unit.gram')}`}
            name="fats"
            min="0"
          />
        </Col>
        <Col desktop="4" class="m-mb-2">
          <TextInput
            type="number"
            icon="cookedRice"
            placeholder={`${t('nutrients.carbs')}, ${t('unit.gram')}`}
            name="carbs"
            min="0"
          />
        </Col>
      </Row>
    </>
  )
}
