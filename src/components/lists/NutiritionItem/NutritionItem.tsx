import classNames from 'classnames'
import { Component, createSignal, JSX, Show, splitProps } from 'solid-js'
import { emoji } from '../../../constants/emoji'
import { useT } from '../../../i18n'
import { CancelIcon } from '../../icons/CancelIcon'
import { CheckIcon } from '../../icons/CheckIcon'
import { CrossIcon } from '../../icons/CrossIcon'
import styles from './styles.sass'

type NutritionItemComponent = Component<
JSX.IntrinsicElements['div'] &
DataModel.Nutrition & {
  caption: JSX.Element
  identifier: DataModel.ID
  mass?: DataModel.Mass
  portion?: number
  onClose?: (id: DataModel.ID) => void
}>

/**
 * Renders common nutrition object
 */
export const NutritionItem: NutritionItemComponent = props => {
  const [isRemoving, setIsRemoving] = createSignal<boolean>(false)
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
    'onClose'
  ])

  function handleClose() {
    if (typeof local.onClose === 'function') {
      local.onClose(local.identifier)
    }
  }

  return (
    <div class={classNames(styles.wrapper, local.class)} {...rest}>
      <div class={styles.values}>
        <div class={styles.header}>
          <div class={styles.caption}>
            <div class={styles['caption-text']}>{local.caption}</div>
            <Show when={local.portion}>
              <span class={styles.portion}>
                &times; {local.portion?.toLocaleString()}
              </span>
            </Show>
          </div>

          <div class={styles.mass}>
            {local.mass} {' '}
            <span class={styles.unit}>{t('unit.gram')}</span>
          </div>
        </div>

        <div class={classNames(styles.nutrients, 'm-mt-1')}>
          <div class={classNames(styles.nutrient, styles.protein)}>
            <div class={styles['nutrient-caption']}>
              {/* {emoji.poultryLeg.html} */}
              {t('nutrients.P')}:
            </div>
            <div class={styles['nutrient-value']}>
              {local.proteins} {' '}
              <span class={styles.unit}>{t('unit.gram')}</span>
            </div>
          </div>

          <div class={classNames(styles.nutrient, styles.fats)}>
            <div class={styles['nutrient-caption']}>
              {/* {emoji.avocado.html} */}
              {t('nutrients.F')}:
            </div>
            <div class={styles['nutrient-value']}>
              {local.fats} {' '}
              <span class={styles.unit}>{t('unit.gram')}</span>
            </div>
          </div>

          <div class={classNames(styles.nutrient, styles.carbs)}>
            <div class={styles['nutrient-caption']}>
              {/* {emoji.cookedRice.html} */}
              {t('nutrients.C')}:
            </div>
            <div class={styles['nutrient-value']}>
              {local.carbs} {' '}
              <span class={styles.unit}>{t('unit.gram')}</span>
            </div>
          </div>

          <div class={classNames(styles.nutrient, styles.energy)}>
            <div class={styles['nutrient-caption']}>
              {emoji.highVoltage.html}
              {/* {t('nutrients.E')}: */}
            </div>
            <div class={styles['nutrient-value']}>
              {local.energy} {' '}
              <span class={styles.unit}>{t('unit.kcal')}</span>
            </div>
          </div>
        </div>
      </div>

      <Show when={typeof local.onClose === 'function'}>
        <div class={styles.buttons}>
          <div
            class={
              classNames(
                styles['controls-group'],
                { [styles.visible]: !isRemoving() }
              )
            }
          >
            <div
              class={classNames(styles.close, styles.control)}
              onClick={() => setIsRemoving(true)}
            >
              <CrossIcon />
            </div>
          </div>

          <div
            class={
              classNames(
                styles['controls-group'],
                styles.secondary,
                { [styles.visible]: isRemoving() }
              )
            }
          >
            <div
              class={classNames(styles.cancel, styles.control)}
              onClick={() => setIsRemoving(false)}
            >
              <CancelIcon />
            </div>
            <div
              class={classNames(styles.confirm, styles.control)}
              onClick={handleClose}
            >
              <CheckIcon />
            </div>
          </div>
        </div>
      </Show>
    </div>
  )
}
