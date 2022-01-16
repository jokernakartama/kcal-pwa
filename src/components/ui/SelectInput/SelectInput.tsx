import classNames from 'classnames'
import { Component, JSX } from 'solid-js'
import styles from './styles.sass'

type SelectInputComponent = Component<JSX.IntrinsicElements['select']>

/**
 * Renders a select input
 */
export const SelectInput: SelectInputComponent = ({ className, ...rest }) => {
  return <select className={classNames(styles.wrapper, className)} {...rest} />
}
