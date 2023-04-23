import { Outlet, useParams, useRouteData } from '@solidjs/router'
import { For, Component, createSignal, createMemo, onMount, createResource, createEffect, batch } from 'solid-js'
import { getRecipe, setRecipe } from '../../../api'
import { useT } from '../../../i18n'
import { BasicViewNavigation } from '../../../routes/types'
import { useProfile } from '../../../store'
import { InputChangeEvent } from '../../../types/inputEvents'
import { ListItem } from '../../../types/utils'
import { PlusIcon } from '../../icons/PlusIcon'
import { Container } from '../../layout/Grid'
import { ProductListItem } from '../../lists/ProductList'
import { useEventBus } from '../../providers/EventBus'
import { Button } from '../../ui/Button'
import { ButtonPanel } from '../../ui/ButtonPanel/ButtonPanel'
import { Dialog } from '../../ui/Dialog'
import { Form, getFormValues } from '../../ui/Form'
import { FormSubmitEvent } from '../../ui/Form/types'
import { Textarea } from '../../ui/Textarea'
import { TextInput } from '../../ui/TextInput'
import styles from './styles.sass'

export interface RecipeViewNavigation extends BasicViewNavigation {
  toProducts: () => void
  toProduct: (id: DataModel.Product['id']) => void
  toTarget: (id: DataModel.Recipe['id']) => void
}

type RecipeViewComponent = Component<{
  withTarget?: boolean
}>

/**
 * Shows a dialog to create/update a recipe
 * @todo Make possible to edit an existing reciipe
 */
export const RecipeView: RecipeViewComponent = props => {
  const eventBus = useEventBus()
  const params = useParams<{ id?: string }>()
  const user = useProfile()
  const go = useRouteData<RecipeViewNavigation>()
  const t = useT()
  const [recipeName, setRecipeName] = createSignal<string>('')
  const [recipeDescription, setRecipeDescripton] = createSignal<string>('')
  const isReadonly = createMemo<boolean>(() => {
    return (!!params.id && !!props.withTarget)
  })
  const [targetRecipe] = createResource<DataModel.Recipe | undefined, string>(
    params?.id, fetchRecipe
  )
  const [products, setProducts] = createSignal<DataModel.Recipe['products']>([])

  function handleRecipeNameChange(e: InputChangeEvent) {
    setRecipeName(e.target.value)
  }

  function handleRecipeDescriptionChange(
    e: InputChangeEvent<HTMLTextAreaElement>
  ) {
    setRecipeDescripton(e.target.value)
  }

  function mergeProduct(
    prev: ListItem<ReturnType<typeof products>>,
    next: ListItem<ReturnType<typeof products>>,
    replace: boolean
  ): ListItem<ReturnType<typeof products>> {
    return replace ? next : { ...prev, mass: prev.mass + next.mass }
  }

  function addProduct(product: ListItem<ReturnType<typeof products>>) {
    updateProduct(product, true)
  }

  function updateProduct(
    product: ListItem<ReturnType<typeof products>>,
    replace = true
  ) {
    const currentProducts = products()
    if (currentProducts.some(p => p.id === product.id)) {
      setProducts(v => v.map(p => {
        if (p.id === product.id) {
          return mergeProduct(p, product, replace)
        }

        return p
      }))
    } else {
      setProducts(v => [...v, product])
    }
  }

  function removeProduct(i: number) {
    const nextProducts = products().slice()
    nextProducts.splice(i, 1)

    setProducts(nextProducts)
  }

  function fetchRecipe() {
    if (params.id) {
      return getRecipe(+params.id)
    }

    return Promise.resolve(undefined)
  }

  function handleSubmit(e: FormSubmitEvent) {
    e.preventDefault()

    const values = getFormValues<{ name: string, descripiton: string }>(
      e.currentTarget
    )

    setRecipe({
      ...values,
      userId: user.id,
      products: products()
    })
      .then((recipe) => {
        go.toTarget(recipe.id)
      })
      .catch(console.error)
  }

  createEffect(() => {
    const recipe = targetRecipe()
    if (recipe) {
      batch(() => {
        setRecipeName(recipe.name)
        setRecipeDescripton(recipe.description ?? '')
        setProducts(recipe.products)
      })
    }
  })

  onMount(() => {
    eventBus.on('recipe-product-add', addProduct)
    eventBus.on('recipe-product-change', updateProduct)
  })

  return (
    <>
      <Form autocomplete="off" onSubmit={handleSubmit}>
        <Dialog
          class={styles.wrapper}
          onClose={go.quit}
          onBack={go.back}
          header={<h2>{t('dialog.recipe.add')}</h2>}
          footer={
            <>
              <ButtonPanel>
                <Button type="button" disabled={false} color="secondary" onClick={go.back}>
                  {t('button.back')}
                </Button>
                <Button
                  half block
                  disabled={products().length === 0}
                  color="accent"
                  loading={false}
                  type="submit"
                >
                  {t(`button.${props.withTarget ? 'save_add' : 'add'}`)}
                </Button>
                <Button type="button" color="primary" onClick={go.toProducts}>
                  <PlusIcon />
                </Button>
              </ButtonPanel>
            </>
          }
        >
          <Container>
            <TextInput
              readOnly={isReadonly()}
              name="name"
              class="m-mb-2"
              type="text"
              icon="forkAndKnife"
              placeholder={t('recipe.name')}
              value={recipeName()}
              onInput={handleRecipeNameChange}
            />

            <Textarea
              readOnly={isReadonly()}
              name="description"
              class="m-mb-2"
              placeholder={t('recipe.description')}
              value={recipeDescription()}
              onInput={handleRecipeDescriptionChange}
            />

            <For each={products()}>
              {(item, index) => (
                <ProductListItem
                  caption={item.name}
                  identifier={index()}
                  mass={item.mass}
                  product={item}
                  onClick={() => go.toProduct(item.id)}
                  onRemove={removeProduct}
                />
              )}
            </For>
          </Container>
        </Dialog>
      </Form>

      <Outlet />
    </>
  )
}
