import { Component, JSX } from 'solid-js'
import styles from './styles.sass'

type FilterPanelComponent = Component<{
  children?: JSX.Element
}>

export const FilterPanel: FilterPanelComponent = (props) => {
  return (
    <div class={styles.wrapper}>
      {props.children}
    </div>
  )
}
