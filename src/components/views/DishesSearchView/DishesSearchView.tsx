import { useNavigate, useRouteData } from '@solidjs/router'
import { inject } from 'regexparam'
import { Component, createSignal, Match, Show, Switch } from 'solid-js'
import { createRewindNavigator } from '../../../hooks/createRewindNavigator'
import { useT } from '../../../i18n'
import { route } from '../../../routes/constants'
import { ProductList } from '../../lists/ProductList'
import { RecipeList } from '../../lists/RecipeList'
import { Button } from '../../ui/Button'
import { ButtonPanel } from '../../ui/ButtonPanel/ButtonPanel'
import { Dialog } from '../../ui/Dialog'
import { RadioInput } from '../../ui/RadioInput'
import { TextInput } from '../../ui/TextInput'
import { TextInputChangeEvent } from '../../ui/TextInput/types'
import styles from './styles.sass'

type DishesSearchViewComponent = Component

/**
 * Displays list of products/recipes
 */
export const DishesSearchView: DishesSearchViewComponent = () => {
  const routeData = useRouteData<{ only?: DataModel.DishType } | undefined>()
  const [tab, setTab] = createSignal<DataModel.DishType>(routeData?.only ?? 'product')
  const [search, setSearch] = createSignal<string>('')
  const t = useT()
  const navigate = useNavigate()
  const rewind = createRewindNavigator()

  function changeTab(
    e: InputEvent & { currentTarget: HTMLInputElement; target: Element }
  ) {
    setTab(e.currentTarget.value as ReturnType<typeof tab>)
  }

  function createDish() {
    const path = tab() === 'recipe'
      ? `${route.NEW_RECIPE}?next=${route.ADD_DISH}`
      : `${route.NEW_PRODUCT}?next=${route.ADD_DISH}`

    navigate(
      inject(path, { type: tab() }),
      { replace: false }
    )
  }

  function addDish(dish: DataModel.Product | DataModel.Recipe) {
    navigate(
      inject(route.ADD_DISH, { type: tab(), id: dish.id }),
      { replace: false }
    )
  }

  function goBack() {
    rewind(route.NEW_MEAL, -1)
  }

  function closeDialog() {
    rewind(route.HOME, -2)
  }

  function handleSearch(e: TextInputChangeEvent) {
    const searchString = e.target.value
    setSearch(searchString)
  }

  return (
    <Dialog
      class={styles.wrapper}
      onClose={closeDialog}
      onBack={goBack}
      header={<h2>{t(`dialog.dish.select.${tab()}`)}</h2>}
      footer={
        <>
          <ButtonPanel justify="center" class={styles.inputs}>
            <TextInput
              clearable
              autofocus
              icon="magnifyingGlass"
              class={styles.search}
              type="search"
              placeholder={t('button.search')}
              onInput={handleSearch}
            />

            <Show when={!routeData?.only}>
              <div class={styles['radio-wrapper']}>
                <RadioInput
                  class={styles.radio}
                  value={tab()}
                  options={[
                    { value: 'product', label: t('dialog.dish.products') },
                    { value: 'recipe', label: t('dialog.dish.recipes') },
                  ]}
                  onChange={changeTab}
                />
              </div>
            </Show>
          </ButtonPanel>

          <ButtonPanel justify={tab() === 'recipe' ? 'start' : 'end'}>
            <Button color="secondary" onClick={goBack}>
              {t('button.back')}
            </Button>

            <Show when={tab() === 'product'}>
              <Button half block color="accent" type="button" onClick={createDish}>
                {t(`dialog.${tab()}.add`)}
              </Button>
            </Show>
          </ButtonPanel>
        </>
      }
    >

      <Switch>
        <Match when={tab() === 'product'}>
          <ProductList
            class={styles.list}
            search={search()}
            onProductClick={addDish}
          />
        </Match>

        <Match when={tab() === 'recipe'}>
          <RecipeList
            class={styles.list}
            search={search()}
            onRecipeClick={addDish}
          />
        </Match>
      </Switch>
    </Dialog>
  )
}
