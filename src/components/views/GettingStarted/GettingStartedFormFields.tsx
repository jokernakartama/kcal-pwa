import { Component, createMemo } from 'solid-js'
import { emoji } from '../../../constants/emoji'
import { useT } from '../../../i18n'
import { DEFAULT_NUTRIENTS_RATIO, getNutrientMassValue } from '../../../utils/calculations'
import { addYearsToDate } from '../../../utils/date'
import { normalizeDate } from '../../../utils/format'
import { Col, Container, Row } from '../../layout/Grid'
import { useForm } from '../../ui/Form'
import { RadioInput } from '../../ui/RadioInput'
import { RatioInput } from '../../ui/RatioInput'
import { RatioOption } from '../../ui/RatioInput/types'
import { SelectOption } from '../../ui/SelectInput/types'
import { TextInput } from '../../ui/TextInput'
import styles from './styles.sass'
import { GettingStartedForm } from './types'

/**
 * Renders fields for GettingStarted form
 */
export const GettingStartedFormFields: Component = () => {
  const t = useT()
  const { fields } = useForm<GettingStartedForm>()
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
  const maxDate: string = normalizeDate(addYearsToDate(-16))
  const minDate: string = normalizeDate(addYearsToDate(-80))
  const sexOptions = createMemo<
    Array<SelectOption<UserModel.User['sex']>>
  >(
    () => [
      { label: `${emoji.man.string} ${t('profile.male')}`, value: 'male' },
      { label: `${emoji.woman.string} ${t('profile.female')}`, value: 'female' }
    ]
  )
  const ratioOptions: RatioOption[] = [
    { label: t('nutrients.proteins'), defaultValue: DEFAULT_NUTRIENTS_RATIO.proteins, color: 'blue' },
    { label: t('nutrients.fats'), defaultValue: DEFAULT_NUTRIENTS_RATIO.fats, color: 'yellow' },
    { label: t('nutrients.carbs'), defaultValue: DEFAULT_NUTRIENTS_RATIO.carbs, color: 'green' }
  ]

  return (
    <Container class={styles.content}>
      <div class={styles.headers}>
        <h1 class="m-mb-2 m-mt-2">{t('welcome.personal.header')}</h1>
      </div>

      <div class={styles.fields}>
        <Row>
          <Col mobile="12" tablet="5" desktop="4" class="m-mb-2">
            <TextInput
              required
              autofocus
              type="text"
              placeholder={t('profile.name')}
              icon="bustInSilhouette"
              name="name"
              maxlength="30"
            />
          </Col>
          <Col mobile="12" tablet="4" desktop="4" class="m-mb-2">
            <TextInput
              required
              type="date"
              icon="birthday"
              placeholder={t('profile.birthday')}
              name="birthDate"
              min={minDate}
              max={maxDate}
            />
          </Col>

          <Col mobile="12" tablet="3" desktop="4" class="m-mb-3">
            <div class={styles['sex-options']}>
              <RadioInput
                class={styles.card}
                name="sex"
                options={sexOptions()}
                value={sexOptions()[0].value}
              />
            </div>
          </Col>
        </Row>

        <div class={styles.headers}>
          <h3 class="m-mb-2 m-mt-2">{t('goals.header')}</h3>
        </div>

        <Row>
          <Col desktop="4">
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
            />
          </Col>
        </Row>

        <Row>
          <Col desktop="4" class="m-mb-4">
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
          <Col desktop="4" class="m-mb-2">
            <RatioInput
              name="ratio"
              parts={ratioOptions}
            />
            <input name="proteins" type="hidden" value={proteins()}/>
            <input name="fats" type="hidden" value={fats()}/>
            <input name="carbs" type="hidden" value={carbs()}/>
          </Col>
        </Row>
      </div>
    </Container>
  )
}
