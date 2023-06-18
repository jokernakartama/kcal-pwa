import {
  JSX,
  Component,
  For,
  splitProps,
  createSignal,
  createEffect,
  on,
  createMemo,
  onMount
} from 'solid-js'
import { getRecipes, removeRecipe } from '../../../api'
import { useT } from '../../../i18n'
import { useProfile, useStore } from '../../../store'
import { PaginationParams, SortingDirection } from '../../../types/pagination'
import { useEventBus } from '../../providers/EventBus'
import { PageScroll } from '../../ui/PageScroll/PageScroll'
import { RecipeListItem } from './RecipeListItem'

type RecipeListComponent = Component<
JSX.IntrinsicElements['div'] & {
  detailed?: boolean
  /** Id or array of ids of recipes */
  recipes?: number | number[]
  search?: string,
  sort?: 'name' | 'id'
  dir?: SortingDirection
  onRecipeClick?: (recipe: DataModel.Recipe) => void
}
>

/**
 * Renders scrollable paginated recipes list
 */
export const RecipeList: RecipeListComponent = props => {
  const eventBus = useEventBus()
  const t = useT()
  const [, setStore] = useStore()
  const user = useProfile()
  const [local, rest] = splitProps(props, [
    'class', 'recipes', 'search', 'sort', 'dir', 'onRecipeClick'
  ])
  const searchString = createMemo(() => props.search)
  const recipesSignal = createSignal<DataModel.Recipe[] | undefined>([])
  const [recipes, setRecipes] = recipesSignal

  function fetchRecipes({ offset, limit }: PaginationParams) {
    return getRecipes(user.id, {
      id: local.recipes,
      name: local.search,
      sort: local.sort ?? 'id',
      dir: local.dir ?? 'desc',
      limit, offset
    })
  }

  function deleteRecipe(id: DataModel.Recipe['id']) {
    removeRecipe(id)
      .then(() => {
        setRecipes(v => v!.filter(recipe => recipe.id !== id))
        markRecipeInStore(id)
      })
      .catch(e => {
        console.error(e)
      })
  }

  function markRecipeInStore(id: DataModel.Recipe['id']) {
    setStore(
      'meals',
      meal => meal.dishes.some(
        dish => dish.type === 'recipe' && dish.target.id === id
      ),
      'dishes',
      dishes => dishes.map(dish => {
        if (dish.type === 'recipe' && dish.target.id === id) {
          return {
            isArchieved: true,
            ...dish,
          }
        }

        return dish
      })
    )
  }

  function handleRecipeClick(recipe: DataModel.Recipe) {
    if (typeof local.onRecipeClick === 'function') {
      local.onRecipeClick(recipe)
    }
  }

  function updateRecipes() {
    // This action will update the list because of internal mechanism
    // of `PageScroll`
    setRecipes([])
  }

  createEffect(on(searchString, () => {
    setRecipes(undefined)
  }))

  onMount(() => {
    eventBus.on('update-recipes', updateRecipes)
  })

  return (
    <PageScroll<DataModel.Recipe>
      class={local.class}
      fetch={fetchRecipes}
      signal={recipesSignal}
      {...rest}
    >
      <For each={recipes()} fallback={t('recipes.empty')}>
        {(item, index) => (
          <RecipeListItem
            detailed={props.detailed}
            caption={item.name}
            identifier={item.id}
            recipe={item}
            onClick={() => handleRecipeClick(recipes()![index()])}
            onRemove={deleteRecipe}
          />
        )}
      </For>
    </PageScroll>
  )
}
