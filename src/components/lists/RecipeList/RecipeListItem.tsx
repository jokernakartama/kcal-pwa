import classNames from 'classnames'
import { createMemo, For, JSX, Show, splitProps } from 'solid-js'
import { emoji } from '../../../constants/emoji'
import { useT } from '../../../i18n'
import { calculateRecipeNutrition } from '../../../utils/data'
import { ListItem, ListItemComponent } from '../ListItem'
import styles from './styles.sass'

type RecipeListItemComponent = ListItemComponent<{
  caption: JSX.Element
  recipe: Omit<DataModel.Recipe, 'userId'>
  archieved?: boolean
  portion?: number
  detailed?: boolean
}>

/**
 * Renders common nutrition object
 */
export const RecipeListItem: RecipeListItemComponent = props => {
  const t = useT()
  const [local, rest] = splitProps(props, [
    'caption',
    'identifier',
    'portion',
    'recipe',
    'archieved',
    'class',
    'detailed',
    'children',
    'onRemove'
  ])

  const nutrients = createMemo<DataModel.Nutrition>(() => {
    return calculateRecipeNutrition(local.recipe, local.portion)
  })

  const mass = createMemo<number>(() => {
    return local.recipe.products
      .reduce(
        (total, product) => total + product.mass * (local.portion ?? 1),
        0
      )
  })

  return (
    <ListItem
      identifier={local.identifier}
      class={classNames(local.class, { [styles.archieved]: local.archieved })}
      onRemove={local.onRemove}
      {...rest}
    >
      <div class={styles.header}>
        <div class={styles.caption}>
          <div class={styles['caption-text']}>
            {local.caption}
            <Show when={local.archieved}>
              {' '}<b>({t('label.archieved')})</b>
            </Show>
          </div>
          <Show when={local.portion}>
            <span class={styles.portion}>
                &times; {local.portion!.toLocaleString()}
            </span>
          </Show>

        </div>

        <div class={styles.mass}>
          {mass()} {' '}
          <span class={styles.unit}>{t('unit.gram')}</span>
        </div>
      </div>

      <Show when={local.detailed}>
        <ul class={classNames(styles.details)}>
          <For each={local.recipe.products}>
            {item => (
              <li>
                <span class={styles['product-name']}>
                - {item.name}
                </span>
                <span class={styles['product-nutrition']}>
                </span>
                <span class={styles['product-mass']}>
                  {Math.round(item.mass)} {' '}
                  <span class={styles.unit}>{t('unit.gram')}</span>
                </span>
              </li>
            )}
          </For>
        </ul>
      </Show>

      <div class={classNames(styles.nutrients, 'm-mt-1')}>
        <div class={classNames(styles.nutrient, styles.protein)}>
          <div class={styles['nutrient-caption']}>
            {t('nutrients.P')}:
          </div>
          <div class={styles['nutrient-value']}>
            {Math.round(nutrients().proteins)} {' '}
            <span class={styles.unit}>{t('unit.gram')}</span>
          </div>
        </div>

        <div class={classNames(styles.nutrient, styles.fats)}>
          <div class={styles['nutrient-caption']}>
            {t('nutrients.F')}:
          </div>
          <div class={styles['nutrient-value']}>
            {Math.round(nutrients().fats)} {' '}
            <span class={styles.unit}>{t('unit.gram')}</span>
          </div>
        </div>

        <div class={classNames(styles.nutrient, styles.carbs)}>
          <div class={styles['nutrient-caption']}>
            {t('nutrients.C')}:
          </div>
          <div class={styles['nutrient-value']}>
            {Math.round(nutrients().carbs)} {' '}
            <span class={styles.unit}>{t('unit.gram')}</span>
          </div>
        </div>

        <div class={classNames(styles.nutrient, styles.energy)}>
          <div class={styles['nutrient-caption']}>
            {emoji.highVoltage.html}
          </div>
          <div class={styles['nutrient-value']}>
            {Math.round(nutrients().energy)} {' '}
            <span class={styles.unit}>{t('unit.kcal')}</span>
          </div>
        </div>
      </div>
    </ListItem>
  )
}
