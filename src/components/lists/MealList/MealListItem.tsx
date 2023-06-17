import classNames from 'classnames'
import { Show, splitProps } from 'solid-js'
import { emoji } from '../../../constants/emoji'
import { useT } from '../../../i18n'
import { getMealEmojiFromLabel, getMealLabelFromDate } from '../../../utils/data'
import { timeToEmoji } from '../../../utils/timeToEmoji'
import { ListItem, ListItemComponent } from '../ListItem'
import styles from './styles.sass'

type MealListItemComponent = ListItemComponent<{
  meal: Omit<DataModel.Meal, 'userId'>
} & DataModel.Nutrition>

/**
 * Renders a meal item
 */
export const MealListItem: MealListItemComponent = props => {
  const t = useT()
  const [local, rest] = splitProps(props, [
    'identifier',
    'meal',
    'proteins',
    'fats',
    'carbs',
    'energy',
    'class',
    'onRemove'
  ])
  const mealLabel = local.meal.label
    ? local.meal.label
    : getMealLabelFromDate(local.meal.time)
  const mealEmoji = getMealEmojiFromLabel(mealLabel)

  return (
    <>
      <div class={styles.label}>
        {mealEmoji.html}{' '}
        <b>{t(`mealLabel.${mealLabel}`)}</b>
      </div>
      <ListItem
        identifier={local.meal.id}
        onRemove={local.onRemove}
        {...rest}
      >
        <div class={styles.item}>
          <div class={styles.clock}>
            {timeToEmoji(local.meal.time).html}
            <div class={styles.time}>
              {local.meal.time.toTimeString().slice(0, 5)}
            </div>
          </div>

          <div class={styles.info}>
            <div class={classNames(styles.nutrients)}>
              <div class={classNames(styles.nutrient, styles.protein)}>
                <div class={styles['nutrient-caption']}>
                  {emoji.poultryLeg.html}
                  {/* {t('nutrients.P')}: */}
                </div>
                <div class={styles['nutrient-value']}>
                  {Math.round(local.proteins)} {' '}
                  <span class={styles.unit}>{t('unit.gram')}</span>
                </div>
              </div>

              <div class={classNames(styles.nutrient, styles.fats)}>
                <div class={styles['nutrient-caption']}>
                  {emoji.avocado.html}
                  {/* {t('nutrients.F')}: */}
                </div>
                <div class={styles['nutrient-value']}>
                  {Math.round(local.fats)} {' '}
                  <span class={styles.unit}>{t('unit.gram')}</span>
                </div>
              </div>

              <div class={classNames(styles.nutrient, styles.carbs)}>
                <div class={styles['nutrient-caption']}>
                  {emoji.cookedRice.html}
                  {/* {t('nutrients.C')}: */}
                </div>
                <div class={styles['nutrient-value']}>
                  {Math.round(local.carbs)} {' '}
                  <span class={styles.unit}>{t('unit.gram')}</span>
                </div>
              </div>
            </div>

            <div class={styles['energy-wrapper']}>
              <div class={styles.energy}>
                <b>{Math.round(local.energy)}</b> {' '}
                <span class={styles.unit}>{t('unit.kcal')}</span>
              </div>

              <div class={styles.dishes}>
                {local.meal.dishes[0].target.name}
                <Show when={local.meal.dishes.length > 1}>
                  {' '}
                  {t('label.and_more', { count: local.meal.dishes.length - 1 })}
                </Show>
              </div>
            </div>
          </div>
        </div>
      </ListItem>
    </>
  )
}
