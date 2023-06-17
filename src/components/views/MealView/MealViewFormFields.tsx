import { Component, createMemo } from 'solid-js'
import { emoji } from '../../../constants/emoji'
import { useT } from '../../../i18n'
import { Col, Row } from '../../layout/Grid'
import { SelectInput } from '../../ui/SelectInput'
import { SelectOption } from '../../ui/SelectInput/types'
import { TextInput } from '../../ui/TextInput'

type MealViewFormFieldsComponent = Component

/**
 * Renders fields for MealView form
 */
export const MealViewFormFields: MealViewFormFieldsComponent = props => {
  const t = useT()
  const labelOptions = createMemo<
  Array<SelectOption<DataModel.MealLabel>>
  >(
    () => [
      { label: `${emoji.pretzel.string} ${t('mealLabel.snack')}`, value: 'snack' },
      { label: `${emoji.friedEgg.string} ${t('mealLabel.breakfast')}`, value: 'breakfast' },
      { label: `${emoji.sandwich.string} ${t('mealLabel.brunch')}`, value: 'brunch' },
      { label: `${emoji.bento.string} ${t('mealLabel.lunch')}`, value: 'lunch' },
      { label: `${emoji.panOfFood.string} ${t('mealLabel.dinner')}`, value: 'dinner' }
    ]
  )

  return (
    <>
      <Row>
        <Col desktop="3" class="m-mb-2">
          <TextInput
            required
            type="time"
            icon="threeOClock"
            placeholder={t('dialog.meal.time')}
            name="time"
          />
        </Col>
        <Col desktop="9" class="m-mb-2">
          <SelectInput
            required
            type="text"
            placeholder={t('dialog.meal.label')}
            name="label"
            options={labelOptions()}
          />
        </Col>
      </Row>
    </>
  )
}
