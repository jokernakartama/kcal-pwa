import { Outlet, useRouteData } from '@solidjs/router'
import { Component, createSignal, Match, Show, Switch } from 'solid-js'
import { useT } from '../../../i18n'
import { BasicViewNavigation } from '../../../routes/types'
import { InputChangeEvent } from '../../../types/inputEvents'
import { isRecipe } from '../../../utils/data'
import { Container } from '../../layout/Grid'
import { ProductList } from '../../lists/ProductList'
import { RecipeList } from '../../lists/RecipeList'
import { Button } from '../../ui/Button'
import { ButtonPanel } from '../../ui/ButtonPanel/ButtonPanel'
import { Dialog } from '../../ui/Dialog'
import { RadioInput } from '../../ui/RadioInput'
import { TextInput } from '../../ui/TextInput'
import styles from './styles.sass'

export interface DishesSearchViewNavigation extends BasicViewNavigation {
  toCreate: (type: DataModel.DishType) => void
  toDish: (id: DataModel.ID, type: DataModel.DishType) => void
}

type DishesSearchViewComponent = Component<{
  only?: DataModel.DishType
}>

/**
 * Displays list of products/recipes
 */
export const DishesSearchView: DishesSearchViewComponent = props => {
  const go = useRouteData<DishesSearchViewNavigation>()
  const [tab, setTab] = createSignal<DataModel.DishType>(
    props?.only ?? 'product'
  )
  const [search, setSearch] = createSignal<string>('')
  const t = useT()

  function changeTab(e: InputChangeEvent) {
    setTab(e.currentTarget.value as ReturnType<typeof tab>)
  }

  function createDish() {
    go.toCreate(tab())
  }

  function changeDishAmount(dish: DataModel.Product | DataModel.Recipe) {
    const type: DataModel.DishType = isRecipe(dish) ? 'recipe' : 'product'
    go.toDish(dish.id, type)
  }

  function handleSearch(e: InputChangeEvent) {
    const searchString = e.target.value
    setSearch(searchString)
  }

  return (
    <>
      <Dialog
        class={styles.wrapper}
        onClose={go.quit}
        onBack={go.back}
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

              <Show when={!props?.only}>
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
              <Button type="button" color="secondary" onClick={go.back}>
                {t('button.back')}
              </Button>

              <Button
                half block
                color="accent"
                type="button"
                onClick={createDish}
              >
                {t(`dialog.${tab()}.add`)}
              </Button>
            </ButtonPanel>
          </>
        }
      >

        <Container class={styles['list-wrapper']}>
          <Switch>
            <Match when={tab() === 'product'}>
              <ProductList
                class={styles.list}
                search={search()}
                onProductClick={changeDishAmount}
              />
            </Match>

            <Match when={tab() === 'recipe'}>
              <RecipeList
                detailed
                class={styles.list}
                search={search()}
                onRecipeClick={changeDishAmount}
              />
            </Match>
          </Switch>
        </Container>
      </Dialog>

      <Outlet />
    </>
  )
}
