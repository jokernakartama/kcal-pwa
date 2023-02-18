import { hashIntegration, Router, staticIntegration } from '@solidjs/router'
import { render } from 'solid-js/web'
import { App } from './App'
import { registerServiceWorker } from './serviceWorker'

const container = window.document.getElementById('app')
const isStandalone = window.location.search.includes('?standalone=true')
const locationObject = { value: '/' }
const integration = isStandalone ? hashIntegration() : staticIntegration(locationObject)

if (container !== null) {
  render(() => <Router source={integration}><App /></Router>, container)
}

registerServiceWorker()
