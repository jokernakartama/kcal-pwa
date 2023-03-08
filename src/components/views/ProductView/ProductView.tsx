import { useNavigate, useSearchParams } from '@solidjs/router'
import { inject } from 'regexparam'
import { Component, createSignal } from 'solid-js'
import { setProduct } from '../../../api'
import { createRewindNavigator } from '../../../hooks/createRewindNavigator'
import { useT } from '../../../i18n'
import { route } from '../../../routes/constants'
import { useProfile } from '../../../store'
import { ProductForm, ProductFormValues } from '../../forms/ProductForm'
import { Button } from '../../ui/Button'
import { ButtonPanel } from '../../ui/ButtonPanel/ButtonPanel'
import { Dialog } from '../../ui/Dialog'
import { Form, getFormValues } from '../../ui/Form'
import { FormSubmitEvent } from '../../ui/Form/types'
import styles from './styles.sass'

/**
 * Shows a dialog to create/update a product
 * @todo Make possible to edit an existing product
 */
export const ProductView: Component = () => {
  const [isLoading, setIsLoading] = createSignal<boolean>(false)
  const t = useT()
  const user = useProfile()
  const [query] = useSearchParams<{ next?: string }>()
  const navigate = useNavigate()
  const rewind = createRewindNavigator()

  function updateProduct(product: ProductFormValues) {
    setIsLoading(true)

    return setProduct({
      userId: user.id,
      ...product
    })
      .finally(() => {
        setIsLoading(false)
      })
  }

  function goNext(productId: DataModel.Product['id']) {
    const pathname = inject(
      query.next ? query.next : route.HOME,
      { id: productId }
    )
    navigate(pathname, { replace: true })
  }

  function goBack() {
    rewind(route.ADD_DISH, -1)
  }

  function closeDialog() {
    rewind(route.HOME, -3)
  }

  function handleSubmit(e: FormSubmitEvent) {
    e.preventDefault()

    const values = getFormValues<ProductFormValues>(e.currentTarget)

    updateProduct(values)
      .then(product => {
        goNext(product.id)
      })
      .catch(console.error)
  }

  return (
    <Form autocomplete="off" onSubmit={handleSubmit}>
      <Dialog
        class={styles.wrapper}
        onClose={closeDialog}
        onBack={goBack}
        header={<h2>{t('dialog.product.add')}</h2>}
        footer={
          <>
            <ButtonPanel>
              <Button disabled={isLoading()} color="secondary" onClick={goBack}>
                {t('button.back')}
              </Button>
              <Button color="primary" loading={isLoading()} type="submit">
                {t(`button.${query.next === route.ADD_PRODUCT ? 'save_add' : 'add'}`)}
              </Button>
            </ButtonPanel>
          </>
        }
      >
        <ProductForm />
      </Dialog>
    </Form>
  )
}
