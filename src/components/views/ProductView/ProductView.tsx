import { useParams, useRouteData } from '@solidjs/router'
import { Component, createEffect, createMemo, createResource, createSignal } from 'solid-js'
import { getProduct, setProduct } from '../../../api'
import { useT } from '../../../i18n'
import { BasicViewNavigation } from '../../../routes/types'
import { useProfile } from '../../../store'
import { ProductForm, ProductFormValues } from '../../forms/ProductForm'
import { Container } from '../../layout/Grid'
import { Button } from '../../ui/Button'
import { ButtonPanel } from '../../ui/ButtonPanel/ButtonPanel'
import { Dialog } from '../../ui/Dialog'
import { Form, getFormValues } from '../../ui/Form'
import { FormSubmitEvent } from '../../ui/Form/types'
import styles from './styles.sass'

export interface ProductViewNavigation extends BasicViewNavigation {
  toTarget: (id: DataModel.Product['id']) => void
}

type ProductViewComponent = Component<{
  withTarget?: boolean
}>

/**
 * Shows a dialog to create/update a product
 */
export const ProductView: ProductViewComponent = props => {
  const go = useRouteData<ProductViewNavigation>()
  const params = useParams<{ pid?: string }>()
  const t = useT()
  const [isLoading, setIsLoading] = createSignal<boolean>(false)
  const [fields, setFields] = createSignal<ProductFormValues | undefined>()
  const user = useProfile()
  const isReadonly = createMemo<boolean>(() => {
    return (!!params.pid && !!props.withTarget)
  })
  const isToEdit = createMemo<boolean>(() => {
    return (!!params.pid && !props.withTarget)
  })
  const [targetProduct] = createResource<DataModel.Product | undefined, string>(
    params?.pid, fetchProduct
  )

  function updateProduct(product: ProductFormValues) {
    setIsLoading(true)

    return setProduct({
      userId: user.id,
      id: params.pid ? +params.pid : undefined,
      ...product
    })
      .finally(() => {
        setIsLoading(false)
      })
  }

  function fetchProduct() {
    if (params.pid) {
      return getProduct(+params.pid)
    }

    return Promise.resolve(undefined)
  }

  function handleSubmit(e: FormSubmitEvent) {
    e.preventDefault()

    const values = getFormValues<ProductFormValues>(
      e.currentTarget
    )

    updateProduct(values)
      .then((recipe) => {
        go.toTarget(recipe.id)
      })
      .catch(console.error)
  }

  createEffect(() => {
    const product = targetProduct()
    if (product) {
      setFields({
        name: product.name,
        proteins: product.proteins,
        fats: product.fats,
        carbs: product.carbs,
        energy: product.energy
      })
    }
  })

  return (
    <Form autocomplete="off" defaults={fields()} onSubmit={handleSubmit}>
      <Dialog
        class={styles.wrapper}
        onClose={go.quit}
        onBack={go.back}
        header={
          <h2>{t(`dialog.product.${isToEdit() ? 'change' : 'add'}`)}</h2>
        }
        footer={
          <>
            <ButtonPanel>
              <Button type="button" disabled={isLoading()} color="secondary" onClick={go.back}>
                {t('button.back')}
              </Button>
              <Button
                half
                block
                color="primary"
                loading={isLoading()}
                type="submit"
              >
                {t(`button.${
                  isToEdit()
                    ? 'change'
                    : props.withTarget ? 'save_add' : 'add'}`)
                }
              </Button>
            </ButtonPanel>
          </>
        }
      >
        <Container>
          <ProductForm isReadonly={isReadonly()} />
        </Container>
      </Dialog>
    </Form>
  )
}
