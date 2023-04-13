import { Component, createMemo } from 'solid-js'
import { emoji } from '../../../constants/emoji'
import { useT } from '../../../i18n'
import { useStore } from '../../../store'
import { DEFAULT_NUTRIENTS_RATIO, getNutrientMassValue } from '../../../utils/calculations'
import { Col, Row } from '../../layout/Grid'
import { useForm } from '../../ui/Form'
import { RatioInput } from '../../ui/RatioInput'
import { RatioOption } from '../../ui/RatioInput/types'
import { TextInput } from '../../ui/TextInput'
import styles from './styles.sass'
import { GoalsViewFormValues } from './types'

/**
 * Renders fields for GoalsView form
 */
export const GoalsViewFormFields: Component = () => {
  const [store] = useStore()
  const t = useT()
  const { fields } = useForm<GoalsViewFormValues>()
  const proteins = createMemo(() => {
    return getNutrientMassValue(
      'proteins',
      fields.energy?.value ?? 0, fields.ratio?.value[0]
    )
  })
  const fats = createMemo(() => {
    return getNutrientMassValue(
      'fats',
      fields.energy?.value ?? 0, fields.ratio?.value[1]
    )
  })
  const carbs = createMemo(() => {
    return getNutrientMassValue(
      'carbs',
      fields.energy?.value ?? 0, fields.ratio?.value[2]
    )
  })
  const ratioOptions = createMemo<RatioOption[]>(() => {
    const ratio: NonNullable<UserModel.Info['nutrientsRatio']> =
      store.info?.nutrientsRatio || [
        DEFAULT_NUTRIENTS_RATIO.proteins,
        DEFAULT_NUTRIENTS_RATIO.fats,
        DEFAULT_NUTRIENTS_RATIO.carbs
      ]
    return [
      {
        label: t('nutrients.proteins'),
        defaultValue: ratio[0],
        color: 'blue'
      },
      {
        label: t('nutrients.fats'),
        defaultValue: ratio[1],
        color: 'yellow'
      },
      {
        label: t('nutrients.carbs'),
        defaultValue: ratio[2],
        color: 'green'
      }
    ]
  })

  return (
    <>
      <Row>
        <Col>
          <TextInput
            required
            type="number"
            step="1"
            pattern="\d*"
            placeholder={t('goals.energy')}
            icon="highVoltage"
            name="energy"
            min="1000"
            max="5000"
            value={store.goals?.energy}
          />
        </Col>
      </Row>

      <Row>
        <Col class="m-mb-4">
          <small class={styles['energy-hint']}>
            <span>
              {emoji.poultryLeg.html} {t('nutrients.P')}{': '}
              {Math.round(proteins())} {t('unit.gram')}
            </span>
            <span>
              {emoji.avocado.html} {t('nutrients.F')}{': '}
              {Math.round(fats())} {t('unit.gram')}
            </span>
            <span>
              {emoji.cookedRice.html} {t('nutrients.C')}{': '}
              {Math.round(carbs())} {t('unit.gram')}
            </span>
          </small>
        </Col>
      </Row>

      <Row>
        <Col class="m-mb-2">
          <RatioInput
            name="ratio"
            parts={ratioOptions()}
          />
          <input name="proteins" type="hidden" value={proteins()}/>
          <input name="fats" type="hidden" value={fats()}/>
          <input name="carbs" type="hidden" value={carbs()}/>
        </Col>
      </Row>
    </>
  )
}
