import { Component } from 'solid-js'
import styles from './styles.sass'

type DishNutritionItemComponent = Component<{
  value: number
  label: string
  unit: string
}>

export const DishNutritionItem: DishNutritionItemComponent = props => {
  return (
    <div class={styles.nutrient}>
      <div class={styles['nutrient-caption']}>
        {props.label}
      </div>
      <div class={styles['nutrient-value']}>
        {Math.round(props.value)}&nbsp;<small>{props.unit}</small>
      </div>
    </div>
  )
}
