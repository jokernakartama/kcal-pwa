import {
  JSX,
  Component,
  For,
  splitProps,
  createSignal,
  createEffect,
  on,
  createMemo
} from 'solid-js'
import { getRecipes, removeRecipe } from '../../../api'
import { useT } from '../../../i18n'
import { useProfile } from '../../../store'
import { PaginationParams, SortingDirection } from '../../../types/pagination'
import { calculateRecipeNutrition } from '../../../utils/data'
import { PageScroll } from '../../ui/PageScroll/PageScroll'
import { NutritionItem } from '../NutiritionItem'

type RecipeListComponent = Component<
JSX.IntrinsicElements['div'] & {
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
  const t = useT()
  const user = useProfile()
  const [local, rest] = splitProps(props, [
    'class', 'recipes', 'search', 'sort', 'dir', 'onRecipeClick'
  ])
  const searchString = createMemo(() => props.search)
  const recipesSignal = createSignal<DataModel.Recipe[] | undefined>([])
  const [recipes, setRecipes] = recipesSignal
  const recipesNutrition = createMemo(() => {
    if (typeof recipes() === 'undefined') return []

    return recipes()!.map(recipe => {
      return {
        ...calculateRecipeNutrition(recipe),
        name: recipe.name,
        id: recipe.id,
        mass: recipe
          .products
          .reduce((mass, product) => mass + product.mass, 0)
      }
    })
  })

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
      })
      .catch(e => {
        console.error(e)
      })
  }

  function handleRecipeClick(recipe: DataModel.Recipe) {
    if (typeof local.onRecipeClick === 'function') {
      local.onRecipeClick(recipe)
    }
  }

  createEffect(on(searchString, () => {
    setRecipes(undefined)
  }))

  return (
    <PageScroll<DataModel.Recipe>
      class={local.class}
      fetch={fetchRecipes}
      signal={recipesSignal}
      {...rest}
    >
      <For each={recipesNutrition()} fallback={t('recipes.empty')}>
        {(item, index) => (
          <NutritionItem
            caption={item.name}
            identifier={item.id}
            proteins={item.proteins}
            fats={item.fats}
            carbs={item.carbs}
            energy={item.energy}
            mass={item.mass}
            onClick={() => handleRecipeClick(recipes()![index()])}
            onRemove={deleteRecipe}
          />
        )}
      </For>
    </PageScroll>
  )
}
