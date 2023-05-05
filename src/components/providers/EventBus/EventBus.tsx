import { createEmitter, Emitter } from '@solid-primitives/event-bus'
import { createContext, ParentComponent, useContext } from 'solid-js'
import { EventBusEvent } from './types'

const EventBus = createContext<Emitter<EventBusEvent>>()

export const useEventBus = () => {
  const emitter = useContext(EventBus)

  if (!emitter) throw new Error('EventBus context is not provided')

  return emitter
}

/**
 * Provides global events listeners, subscriptions
 */
export const EventBusProvider: ParentComponent = props => {
  const emitter = createEmitter<EventBusEvent>()

  return (
    <EventBus.Provider value={emitter}>
      {props.children}
    </EventBus.Provider>
  )
}
