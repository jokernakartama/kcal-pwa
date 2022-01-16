import classNames from 'classnames'
import { Component } from 'solid-js'
import styles from './styles.sass'

type PanelComponent = Component<{ className?: string }>

/**
 * Renders a panel
 */
export const Panel: PanelComponent = ({ children, className }) => {
  return (
    <div className={classNames(styles.wrapper, className)}>
      Panel: {children}
    </div>
  )
}
