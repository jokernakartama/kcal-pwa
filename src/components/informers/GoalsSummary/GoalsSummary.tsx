import classNames from 'classnames'
import { Component, JSX, Show, splitProps } from 'solid-js'
import { emoji } from '../../../constants/emoji'
import { useT } from '../../../i18n'
import { CircleDiagram } from '../../ui/CircleDiagram'
import { LineDiagram } from '../../ui/LineDiagram'
import { GoalsSummaryValue } from './GoalSummaryValue'
import styles from './styles.sass'

type GoalsSummaryComponent = Component<
JSX.IntrinsicElements['div'] & {
  current: DataModel.Nutrition
  target: DataModel.Nutrition
  loading?: boolean
}
>

/**
 * Renders a block with summary of current/target values of goals
 */
export const GoalsSummary: GoalsSummaryComponent = (props) => {
  const [local, rest] = splitProps(props, [
    'class', 'current', 'target', 'loading'
  ])
  const t = useT()

  return (
    <div
      class={classNames(
        styles.wrapper, local.class
      )}
      {...rest}
    >
      <div class={styles.energy}>
        <div class={styles.caption}>{t('nutrients.energy')}</div>

        <div class={styles['diagram-wrapper']}>
          <CircleDiagram
            color="orange"
            class={styles.diagram}
            value={local.current.energy / local.target.energy}
          />
          <span>{emoji.highVoltage.html}</span>
        </div>
        <GoalsSummaryValue
          current={local.current.energy}
          target={local.target.energy}
          loading={local.loading}
        /> <Show when={!local.loading}>
          <span class={styles.unit}>{t('unit.kcal')}</span>
        </Show>
      </div>

      <div class={styles.nutrients}>
        <div class={styles.nutrient}>
          <label>
            <div class={styles.caption}>{t('nutrients.proteins')}</div>
            <GoalsSummaryValue
              current={local.current.proteins}
              target={local.target.proteins}
              loading={local.loading}
            /> <Show when={!local.loading}>
              <span class={styles.unit}>{t('unit.gram')}</span>
            </Show>
          </label>

          <LineDiagram
            color="blue"
            value={local.current.proteins / local.target.proteins}
          >
            <div class={styles.meter}>
              <span>{emoji.poultryLeg.html}</span>
            </div>
          </LineDiagram>
        </div>

        <div class={styles.nutrient}>
          <label>
            <div class={styles.caption}>{t('nutrients.fats')}</div>
            <GoalsSummaryValue
              current={local.current.fats}
              target={local.target.fats}
              loading={local.loading}
            /> <Show when={!local.loading}>
              <span class={styles.unit}>{t('unit.gram')}</span>
            </Show>
          </label>

          <LineDiagram
            color="yellow"
            value={local.current.fats / local.target.fats}
          >
            <div class={styles.meter}>
              <span>{emoji.avocado.html}</span>
            </div>
          </LineDiagram>
        </div>

        <div class={styles.nutrient}>
          <label>
            <div class={styles.caption}>{t('nutrients.carbs')}</div>
            <GoalsSummaryValue
              current={local.current.carbs}
              target={local.target.carbs}
              loading={local.loading}
            /> <Show when={!local.loading}>
              <span class={styles.unit}>{t('unit.gram')}</span>
            </Show>
          </label>

          <LineDiagram
            color="green"
            value={local.current.carbs / local.target.carbs}
          >
            <div class={styles.meter}>
              <span>{emoji.cookedRice.html}</span>
            </div>
          </LineDiagram>
        </div>
      </div>
    </div>
  )
}
