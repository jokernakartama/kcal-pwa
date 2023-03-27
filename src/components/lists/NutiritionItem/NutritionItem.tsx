import classNames from 'classnames'
import { Component, JSX, Show, splitProps } from 'solid-js'
import { emoji } from '../../../constants/emoji'
import { useT } from '../../../i18n'
import { ListItem } from '../ListItem'
import styles from './styles.sass'

type NutritionItemComponent = Component<
JSX.IntrinsicElements['div'] &
DataModel.Nutrition & {
  caption: JSX.Element
  identifier: DataModel.ID
  mass?: DataModel.Mass
  portion?: number
  onRemove?: (id: DataModel.ID) => void
}>

/**
 * Renders common nutrition object
 */
export const NutritionItem: NutritionItemComponent = props => {
  const t = useT()
  const [local, rest] = splitProps(props, [
    'caption',
    'identifier',
    'portion',
    'energy',
    'proteins',
    'fats',
    'carbs',
    'mass',
    'class',
    'onRemove'
  ])

  return (
    <ListItem
      identifier={local.identifier}
      class={classNames(local.class)}
      onRemove={local.onRemove}
      {...rest}
    >
      <div class={styles.header}>
        <div class={styles.caption}>
          <div class={styles['caption-text']}>{local.caption}</div>
          <Show when={local.portion}>
            <span class={styles.portion}>
                &times; {local.portion?.toLocaleString()}
            </span>
          </Show>
        </div>

        <Show when={local.mass}>
          <div class={styles.mass}>
            {local.mass} {' '}
            <span class={styles.unit}>{t('unit.gram')}</span>
          </div>
        </Show>
      </div>

      <div class={classNames(styles.nutrients, 'm-mt-1')}>
        <div class={classNames(styles.nutrient, styles.protein)}>
          <div class={styles['nutrient-caption']}>
            {/* {emoji.poultryLeg.html} */}
            {t('nutrients.P')}:
          </div>
          <div class={styles['nutrient-value']}>
            {Math.round(local.proteins)} {' '}
            <span class={styles.unit}>{t('unit.gram')}</span>
          </div>
        </div>

        <div class={classNames(styles.nutrient, styles.fats)}>
          <div class={styles['nutrient-caption']}>
            {/* {emoji.avocado.html} */}
            {t('nutrients.F')}:
          </div>
          <div class={styles['nutrient-value']}>
            {Math.round(local.fats)} {' '}
            <span class={styles.unit}>{t('unit.gram')}</span>
          </div>
        </div>

        <div class={classNames(styles.nutrient, styles.carbs)}>
          <div class={styles['nutrient-caption']}>
            {/* {emoji.cookedRice.html} */}
            {t('nutrients.C')}:
          </div>
          <div class={styles['nutrient-value']}>
            {Math.round(local.carbs)} {' '}
            <span class={styles.unit}>{t('unit.gram')}</span>
          </div>
        </div>

        <div class={classNames(styles.nutrient, styles.energy)}>
          <div class={styles['nutrient-caption']}>
            {emoji.highVoltage.html}
          </div>
          <div class={styles['nutrient-value']}>
            {Math.round(local.energy)} {' '}
            <span class={styles.unit}>{t('unit.kcal')}</span>
          </div>
        </div>
      </div>
    </ListItem>

  )
}
