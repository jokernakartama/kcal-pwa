import { Component } from 'solid-js'
import styles from './styles.sass'

export const AppLoading: Component = () => {
  return (
    <div class={styles.wrapper}>
      <h1>Loading...</h1>
    </div>
  )
}
