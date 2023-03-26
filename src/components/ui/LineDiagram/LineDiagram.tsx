import classNames from 'classnames'
import { JSX, ParentComponent, splitProps } from 'solid-js'
import styles from './styles.sass'

type CircleDiagramComponent = ParentComponent<
JSX.IntrinsicElements['div'] & {
  value?: number
  color?: UI.OriginalColorName
}
>

/**
 * Renders a line diagram
 */
export const LineDiagram: CircleDiagramComponent = props => {
  const [local, rest] = splitProps(props, ['value', 'color', 'class', 'children'])

  return (
    <div class={classNames(local.class, styles.wrapper)}>
      <div
        class={styles.scale}
        {...rest}
      />
      <div
        class={classNames(styles[local.color ?? 'blue'], styles.value)}
        style={{
          width: `${Math.max(0, Math.min((local.value ?? 0) * 100, 100))}%`
        }}
      >
        {local.children}
      </div>
    </div>

  )
}
