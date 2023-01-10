import { FormValidity, FormValues } from './types'

/**
 * Parses the numeric value from an input
 * @param {HTMLInputElement} input
 * @returns {number}
 */
function getInputNumberValue(input: HTMLInputElement) {
  return +input.value.replace(/[^0-9]/g, '')
}

/**
 * Parses the boolean value from a checkbox
 * @param {HTMLInputElement} input
 * @returns {boolean}
 */
function getInputCheckboxValue(input: HTMLInputElement) {
  return input.checked
}

/**
 * Parses a date from an input
 * @param {HTMLInputElement} input
 * @returns {string}
 */
function getInputDateValue(input: HTMLInputElement) {
  return input.value
}

export function getFormValidity<T extends FormValues<T>>(
  form: HTMLFormElement
): FormValidity<T> {
  const { elements } = form
  const data: Partial<FormValidity<T>> = {}

  if (elements === undefined) return data as FormValidity<T>

  for (const fieldElement of elements) {
    const fieldName = fieldElement.getAttribute('name')
    const input = fieldElement as HTMLInputElement

    if (input.type === 'radio' && !input.checked) continue
    if (typeof fieldName !== 'string') continue

    data[fieldName as keyof T] = input.validity
  }

  return data as FormValidity<T>
}

/**
 * Collects fields' values from a form
 * @param {SubmitEvent} e
 * @returns {Object}
 */
export function getFormValues<T extends FormValues<T>>(
  form: HTMLFormElement
): T | undefined {
  const { elements } = form
  const data: Partial<FormValues<T>> = {}

  if (elements === undefined) return undefined

  for (const fieldElement of elements) {
    const fieldName = fieldElement.getAttribute('name')
    const input = fieldElement as HTMLInputElement
    let value = input.value as T[keyof T]

    if (typeof fieldName !== 'string') continue

    if (input.type === 'number') {
      value = getInputNumberValue(input) as T[keyof T]
    }

    if (input.type === 'checkbox') {
      value = getInputCheckboxValue(input) as T[keyof T]
    }

    if (input.type === 'date') {
      value = getInputDateValue(input) as T[keyof T]
    }

    if (input.type === 'radio' && !input.checked) continue

    if (input.tagName === 'SELECT') {
      try {
        value = JSON.parse(input.value) as T[keyof T]
      } catch (error) {
        if (typeof error === 'object') {
          // do nothing
        }
      }
    }

    data[fieldName as keyof T] = value
  }

  return data as FormValues<T>
}
