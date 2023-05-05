import classNames from 'classnames'
import {
  Match,
  Switch,
  Component,
  createSignal,
  Show,
  createMemo,
  onMount,
  batch
} from 'solid-js'
import { emoji } from '../../../constants/emoji'
import { useT } from '../../../i18n'
import { InputChangeEvent } from '../../../types/inputEvents'
import {
  calculateProductNutrition,
  calculateRecipeNutrition,
  isRecipe
} from '../../../utils/data'
import { DishNutrition } from '../../informers/DishNutrition'
import { useForm } from '../../ui/Form'
import { TextInput } from '../../ui/TextInput'
import styles from './styles.sass'

export interface DishFormValues { amount: number }

type DishFormComponent = Component<{
  type: DataModel.DishType
  target?: DataModel.BasicProduct | DataModel.BasicRecipe
}>

/**
 * Doesn't render a <Form />
 * Renders dish form fields.
 */
export const DishForm: DishFormComponent = props => {
  const t = useT()
  const { fields } = useForm<DishFormValues>()
  const [mass, setMass] = createSignal<number>(100)
  const [portion, setPortion] = createSignal<number>(1)
  const dishNutrition = createMemo<DataModel.Nutrition | undefined >(() => {
    const { target } = props
    if (!target) return undefined

    if (isRecipe(target)) {
      return calculateRecipeNutrition(target, portion())
    }

    return calculateProductNutrition(
      target as DataModel.BasicProduct,
      mass() ?? 0
    )
  })

  const dishBasicNutrition = createMemo<DataModel.Nutrition | undefined >(() => {
    const { target } = props
    if (!target) return undefined

    if (isRecipe(target)) {
      return calculateRecipeNutrition(target, 1)
    }

    return calculateProductNutrition(target as DataModel.BasicProduct, 100)

  })

  function handleMassInput(e: InputChangeEvent) {
    setMass(+e.target.value)
  }

  function handlePortionInput(e: InputChangeEvent) {
    setPortion(+e.target.value)
  }

  onMount (() => {
    const amount = fields.amount?.value
    if (typeof amount !== 'undefined') {
      batch(() => {
        setMass(amount)
        setPortion(amount)
      })
    }
  })

  return (
    <>
      <Show when={props.target}>
        <h2 class="m-mb-1">{props.target!.name}</h2>

        <div class={classNames(styles['basic-nutrients'], 'm-mb-2')}>
          {t(`dialog.dish.${props.type === 'recipe'
            ? 'per_portion'
            : 'per_100g'
          }`)}:
          <span class={styles['basic-values']}>
            <span>
              {emoji.highVoltage.html}{' '}
              <b>
                {Math.round(dishBasicNutrition()!.energy)}
              </b> {t('unit.kcal')}
            </span>
            <span>
              {emoji.poultryLeg.html}{' '}
              <b>
                {Math.round(dishBasicNutrition()!.proteins)}
              </b> {t('unit.gram')}
            </span>
            <span>
              {emoji.avocado.html}{' '}
              <b>
                {Math.round(dishBasicNutrition()!.fats)}
              </b> {t('unit.gram')}
            </span>
            <span>
              {emoji.cookedRice.html}{' '}
              <b>
                {Math.round(dishBasicNutrition()!.carbs)}
              </b> {t('unit.gram')}
            </span>
          </span>
        </div>
      </Show>

      <Switch>
        <Match when={props.type === 'product'}>
          <TextInput
            required
            clearable
            autofocus
            name="amount"
            value={mass()}
            type="number"
            icon="scales"
            class="m-mb-3"
            min="1"
            step="1"
            max="5000"
            maxlength="4"
            placeholder={`${t('nutrients.mass')}, ${t('unit.gram')}`}
            onInput={handleMassInput}
          />
        </Match>

        <Match when={props.type === 'recipe'}>
          <TextInput
            required
            clearable
            autofocus
            name="amount"
            value={portion()}
            type="number"
            icon="forkAndKnife"
            class="m-mb-3"
            min="1"
            max="5"
            step="1"
            placeholder={t('nutrients.portion')}
            onInput={handlePortionInput}
          />
        </Match>
      </Switch>

      <Show when={!!props.target}>
        <DishNutrition
          class="m-mb-2"
          {...dishNutrition()!}
        />
      </Show>
    </>
  )
}
