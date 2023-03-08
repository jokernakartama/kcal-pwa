import classNames from 'classnames'
import { Context, useContext, Component, JSX, onMount, splitProps, createContext } from 'solid-js'
import { createStore } from 'solid-js/store'
import { getFormValidity, getFormValues } from './helpers'
import styles from './styles.sass'
import { FormContextType, FormValues } from './types'

export const FormContext = createContext<FormContextType<FormValues<object>>>({})

type FormComponent = Component<
  JSX.IntrinsicElements['form'] & { disabled?: boolean }
>

/**
 * Renders a form
 */
export const Form: FormComponent = props => {
  let formElement: HTMLFormElement
  const [local, rest] = splitProps(
    props,
    ['class', 'children', 'disabled', 'onInput', 'ref']
  )
  const [state, setState] = createStore<FormContextType<any>>({})

  function setRef (form: HTMLFormElement) {
    formElement = form

    if (typeof props.ref === 'function') {
      props.ref(form)
    } else {
      props.ref = form
    }
  }

  function getFormContext(form: HTMLFormElement) {
    const values = getFormValues(form)
    const validity = getFormValidity(form)

    if (typeof values === 'undefined') return {}

    return Object.entries(values)
      .reduce<typeof state>((result, [fieldName, fieldValue]) => {
        const fieldValidity = validity[fieldName as keyof typeof validity] as ValidityState
        const fieldData = {
          value: fieldValue,
          validity: {
            badInput: fieldValidity.badInput,
            customError: fieldValidity.customError,
            patternMismatch: fieldValidity.patternMismatch,
            rangeOverflow: fieldValidity.rangeOverflow,
            rangeUnderflow: fieldValidity.rangeUnderflow,
            stepMismatch: fieldValidity.stepMismatch,
            tooLong: fieldValidity.tooLong,
            tooShort: fieldValidity.tooShort,
            typeMismatch: fieldValidity.typeMismatch,
            valid: fieldValidity.valid,
            valueMissing: fieldValidity.valueMissing,
          },
          valid: false
        }

        Object.defineProperty(fieldData, 'valid', {
          get() {
            return !Object.entries((this as typeof fieldData).validity)
              .some(([ruleName, ruleValue]) => ruleName !== 'valid' && !!ruleValue)
          }
        })

        result[fieldName] = fieldData

        return result

      }, {})
  }

  function handleInput(
    e: InputEvent & { currentTarget: HTMLFormElement; target: HTMLInputElement }
  ) {
    setState(s => ({ ...s, ...getFormContext(formElement) }))

    if (typeof local.onInput === 'function') {
      local.onInput(e)
    }
  }

  onMount(() => {
    setState(s => ({ ...s, ...getFormContext(formElement) }))
  })

  return (
    <form
      ref={setRef}
      class={classNames(styles.wrapper, local.class, {
        [styles.disabled]: local.disabled
      })}
      onInput={handleInput}
      on:custom-input={handleInput}
      {...rest}
    >
      <FormContext.Provider value={state}>
        {local.children}
      </FormContext.Provider>
    </form>
  )
}

/**
 * Provides form fields values and their validation data
 */
export function useForm<T extends FormValues<T> = FormValues<object>>() {
  const fields = useContext<FormContextType<T>>(FormContext as Context<FormContextType<T>>)

  return { fields }
}
