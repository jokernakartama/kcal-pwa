import { createContext, ParentComponent, useContext } from 'solid-js'
import { createStore } from 'solid-js/store'
import { initialState } from './constants'
import { AppStore } from './types'

const StoreContext = createContext<AppStore>([initialState, () => {}])

export const useStore = () => useContext(StoreContext)

/**
 * A shortcut to get the user data. Use only in components which
 * are available only when the user is set.
 * @returns {UserModel.User}
 * @throws An error in case if the user is not set yet
 */
export const useUser = () => {
  const [store] = useStore()

  if (!store.user) {
    throw new Error('An attempt to get user before they are set')
  }

  return store.user
}

export const StoreProvider: ParentComponent = props => {
  const [state, setState] = createStore(initialState)

  const store: AppStore = [state, setState]

  return (
    <StoreContext.Provider value={store}>
      {props.children}
    </StoreContext.Provider>
  )
}
