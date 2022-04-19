import { journalActions } from './journal'
import { productsActions } from './products'
import { recipesActions } from './recipes'
import { userActions } from './user'

export const dbWorkerActions = {
  ...userActions,
  ...journalActions,
  ...recipesActions,
  ...productsActions
}
