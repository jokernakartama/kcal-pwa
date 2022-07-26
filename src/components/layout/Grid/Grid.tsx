import classNames from 'classnames'
import { ParentComponent } from 'solid-js'
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

type ContainerComponent = ParentComponent<{ class?: string }>
type RowComponent = ParentComponent<{ class?: string }>
type ColComponent = ParentComponent<{
  class?: string
  mobile?: ColWidth
  desktop?: ColWidth
}>

export const Container: ContainerComponent = props => {
  return (
    <div class={classNames(styles.container, props.class)}>
      {props.children}
    </div>
  )
}

export const Row: RowComponent = props => {
  return (
    <div class={classNames(styles.row, props.class)}>
      {props.children}
    </div>
  )
}

export const Col: ColComponent = props => {
  return (
    <div
      class={classNames(styles.col, props.class, {
        [styles[`col-m-${props.mobile as string}`]]: props.mobile !== undefined,
        [styles[`col-d-${props.desktop as string}`]]:
          props.desktop !== undefined
      })}
    >
      {props.children}
    </div>
  )
}
