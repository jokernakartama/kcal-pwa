import { Component, createMemo, JSX, splitProps } from 'solid-js'
import { describeArc } from '../../../utils/svg'
import styles from './styles.sass'

type CircleDiagramComponent = Component<
JSX.IntrinsicElements['svg'] & {
  value?: number
  color?: UI.OriginalColorName
}
>

const radius = 10.3

/**
 * Renders an svg image of circle diagram
 */
export const CircleDiagram: CircleDiagramComponent = props => {
  const [local, rest] = splitProps(props, ['value', 'color'])
  const d = createMemo(() => {
    let endAngle = (360 * (local.value ?? 0))
    endAngle = endAngle > 359.99 ? 359.99 : endAngle
    return describeArc(12, 12, radius, 0, endAngle)
  })

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <circle
        class={styles.scale}
        cx="12"
        cy="12"
        r={radius}
        stroke-width="3"
      />

      <path
        d={d()}
        class={styles[local.color ?? 'blue']}
        stroke-width="3"
        stroke-linecap="round"
      />
    </svg>
  )
}
