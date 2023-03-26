import classNames from 'classnames'
import { JSX, ParentComponent } from 'solid-js'
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

type ContainerComponent = ParentComponent<JSX.IntrinsicElements['div']>
type RowComponent = ParentComponent<JSX.IntrinsicElements['div']>
type ColComponent = ParentComponent<JSX.IntrinsicElements['div'] & {
  mobile?: ColWidth
  tablet?: ColWidth
  desktop?: ColWidth
  hd?: ColWidth
}>

export const Container: ContainerComponent = props => {
  return (
    <div ref={props.ref} class={classNames(styles.container, props.class)}>
      {props.children}
    </div>
  )
}

export const Row: RowComponent = props => {
  return (
    <div ref={props.ref} class={classNames(styles.row, props.class)}>
      {props.children}
    </div>
  )
}

export const Col: ColComponent = props => {
  return (
    <div
      ref={props.ref}
      class={classNames(styles.col, props.class, {
        [styles[`col-mobile-${props.mobile as string}`]]: props.mobile !== undefined,
        [styles[`col-tablet-${props.tablet as string}`]]:
          props.tablet !== undefined,
        [styles[`col-desktop-${props.desktop as string}`]]:
          props.desktop !== undefined,
        [styles[`col-hd-${props.hd as string}`]]:
          props.hd !== undefined,
      })}
    >
      {props.children}
    </div>
  )
}
