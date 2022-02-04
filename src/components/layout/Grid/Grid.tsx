import classNames from 'classnames'
import { Component } from 'solid-js'
import styles from './styles.sass'

type ColWidth =
  | '0'
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '10'
  | '12'

type ContainerComponent = Component<{ className?: string }>
type RowComponent = Component<{ className?: string }>
type ColComponent = Component<{
  className?: string
  mobile?: ColWidth
  desktop?: ColWidth
}>

export const Container: ContainerComponent = props => {
  return (
    <div className={classNames(styles.container, props.className)}>
      {props.children}
    </div>
  )
}

export const Row: RowComponent = props => {
  return (
    <div className={classNames(styles.row, props.className)}>
      {props.children}
    </div>
  )
}

export const Col: ColComponent = props => {
  return (
    <div
      className={classNames(styles.col, props.className, {
        [styles[`col-m-${props.mobile as string}`]]: props.mobile !== undefined,
        [styles[`col-d-${props.desktop as string}`]]:
          props.desktop !== undefined
      })}
    >
      {props.children}
    </div>
  )
}
