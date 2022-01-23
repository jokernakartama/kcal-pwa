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

type ContainerComponent = Component
type RowComponent = Component
type ColComponent = Component<{
  mobile?: ColWidth
  desktop?: ColWidth
}>

export const Container: ContainerComponent = props => {
  return <div className={styles.container}>{props.children}</div>
}

export const Row: RowComponent = props => {
  return <div className={styles.row}>{props.children}</div>
}

export const Col: ColComponent = props => {
  return (
    <div
      className={classNames(styles.col, {
        [styles[`col-m-${props.mobile as string}`]]: props.mobile !== undefined,
        [styles[`col-d-${props.desktop as string}`]]:
          props.desktop !== undefined
      })}
    >
      {props.children}
    </div>
  )
}
