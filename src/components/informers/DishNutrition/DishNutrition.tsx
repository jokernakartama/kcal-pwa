import classNames from 'classnames'
import { Component, JSX, splitProps } from 'solid-js'
import { useT } from '../../../i18n'
import { DishNutritionItem } from './DishNutritionItem'
import styles from './styles.sass'

type DishNutritionComponent = Component<
JSX.IntrinsicElements['div'] & DataModel.Nutrition
>

/**
 * Shows product/recipe nutrition
 */
export const DishNutrition: DishNutritionComponent = props => {
  const t = useT()
  const [local, rest] = splitProps(
    props,
    ['class', 'energy', 'proteins', 'fats', 'carbs']
  )
  return (
    <div class={classNames(styles.wrapper, local.class)} {...rest}>
      <DishNutritionItem
        label={t('nutrients.energy')}
        value={Math.round(local.energy)}
        unit={t('unit.kcal')}
      />
      <DishNutritionItem
        label={t('nutrients.proteins')}
        value={Math.round(local.proteins)}
        unit={t('unit.gram')}
      />
      <DishNutritionItem
        label={t('nutrients.fats')}
        value={Math.round(local.fats)}
        unit={t('unit.gram')}
      />
      <DishNutritionItem
        label={t('nutrients.carbs')}
        value={Math.round(local.carbs)}
        unit={t('unit.gram')}
      />
    </div>
  )
}
