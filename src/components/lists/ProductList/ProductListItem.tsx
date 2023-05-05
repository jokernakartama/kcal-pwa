import classNames from 'classnames'
import { JSX, Show, splitProps } from 'solid-js'
import { emoji } from '../../../constants/emoji'
import { useT } from '../../../i18n'
import { ListItem, ListItemComponent } from '../ListItem'
import styles from './styles.sass'

type ProductListItemComponent = ListItemComponent<{
  product: Omit<DataModel.Product, 'userId'>
  caption: JSX.Element
  mass?: DataModel.Mass
}>

/**
 * Renders a product list item
 */
export const ProductListItem: ProductListItemComponent = props => {
  const t = useT()
  const [local, rest] = splitProps(props, [
    'caption',
    'identifier',
    'product',
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
            {t('nutrients.P')}:
          </div>
          <div class={styles['nutrient-value']}>
            {Math.round(local.product.proteins * (local.mass ?? 100) / 100)}
            {' '}
            <span class={styles.unit}>{t('unit.gram')}</span>
          </div>
        </div>

        <div class={classNames(styles.nutrient, styles.fats)}>
          <div class={styles['nutrient-caption']}>
            {t('nutrients.F')}:
          </div>
          <div class={styles['nutrient-value']}>
            {Math.round(local.product.fats * (local.mass ?? 100) / 100)}
            {' '}
            <span class={styles.unit}>{t('unit.gram')}</span>
          </div>
        </div>

        <div class={classNames(styles.nutrient, styles.carbs)}>
          <div class={styles['nutrient-caption']}>
            {t('nutrients.C')}:
          </div>
          <div class={styles['nutrient-value']}>
            {Math.round(local.product.carbs * (local.mass ?? 100) / 100)}
            {' '}
            <span class={styles.unit}>{t('unit.gram')}</span>
          </div>
        </div>

        <div class={classNames(styles.nutrient, styles.energy)}>
          <div class={styles['nutrient-caption']}>
            {emoji.highVoltage.html}
          </div>
          <div class={styles['nutrient-value']}>
            {Math.round(local.product.energy * (local.mass ?? 100) / 100)}
            {' '}
            <span class={styles.unit}>{t('unit.kcal')}</span>
          </div>
        </div>
      </div>
    </ListItem>
  )
}
