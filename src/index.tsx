import { Component, createSignal } from 'solid-js'
import { render } from 'solid-js/web'
import { registerServiceWorker } from './serviceWorker'

const Counter: Component = () => {
  const [count, setCount] = createSignal(0)
  const increment = () => setCount(count() + 1)

  return (
    <button
      type="button"
      onClick={increment}
      style={{ width: '50%', height: '50%' }}
    >
      {count()}
    </button>
  )
}

const container = window.document.getElementById('app')

if (container !== null) {
  render(() => <Counter />, container)
}

registerServiceWorker()
