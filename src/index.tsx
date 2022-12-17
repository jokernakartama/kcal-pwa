import { hashIntegration, Router } from '@solidjs/router'
import { render } from 'solid-js/web'
import { App } from './App'
import { registerServiceWorker } from './serviceWorker'

const container = window.document.getElementById('app')

if (container !== null) {
  render(() => <Router source={hashIntegration()}><App /></Router>, container)
}

registerServiceWorker()
