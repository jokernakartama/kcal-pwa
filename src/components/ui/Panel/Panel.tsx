import classNames from 'classnames'
import { ParentComponent } from 'solid-js'
import styles from './styles.sass'

type PanelComponent = ParentComponent<{ class?: string }>

/**
 * Renders a panel
 */
export const Panel: PanelComponent = (props) => {
  return (
    <div class={classNames(styles.wrapper, props.class)}>
      Panel: {props.children}
    </div>
  )
}
