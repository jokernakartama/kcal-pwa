import { Component, createContext, ParentComponent, useContext } from 'solid-js'
import { createStore } from 'solid-js/store'
import { initialState } from './constants'
import { AppStore } from './types'

const StoreContext = createContext<AppStore>([initialState, () => {}])

export const useStore = () => useContext(StoreContext)

export const StoreProvider: ParentComponent = props => {
  const [state, setState] = createStore(initialState)

  const store: AppStore = [state, setState]

  return (
    <StoreContext.Provider value={store}>
      {props.children}
    </StoreContext.Provider>
  )
}
