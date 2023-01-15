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

/**
 * Parses a boolean from a string value of an input
 * @param {HTMLInputElement} input
 * @returns {boolean}
 */
function getBooleanValue(input: HTMLInputElement) {
  return !(
    input.value === 'false' ||
    input.value === '0' ||
    input.value.trim() === '' ||
    input.value === 'null' ||
    input.value === 'NaN' ||
    input.value === 'undefined'
  )
}

/**
 * Parses regular input value according its "type" attribute
 * @param {HTMLInputElement} input
 * @returns {*}
 */
export function parseInputInputValue<T = string | number | boolean>(
  input: HTMLInputElement
) {
  let value = input.value as T

  if (input.type === 'number') {
    value = getInputNumberValue(input) as T
  }

  if (input.type === 'checkbox') {
    value = getInputCheckboxValue(input) as T
  }

  if (input.type === 'date') {
    value = getInputDateValue(input) as T
  }

  if (input.type === 'hidden') {
    try {
      value = JSON.parse(input.value) as T
    } catch (error) {
      if (typeof error === 'object') {
        // do nothing
      }
    }
  }

  return value
}

/**
 * Parses select input value according its "type" attribute
 * @param {HTMLInputElement} input
 * @returns {*}
 */
export function parseSelectInputValue<T = string | boolean | number | object>(
  input: HTMLInputElement
) {
  let value = input.value as T

  const type = input.getAttribute('type')
  if (type === 'number') {
    value = getInputNumberValue(input) as T
  } else if (type === 'boolean') {
    value = getBooleanValue(input) as T
  } else if (type === 'json') {
    try {
      value = JSON.parse(input.value) as T
    } catch (error) {
      if (typeof error === 'object') {
      // do nothing
      }
    }
  }

  return value
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
    if (input.type === 'radio' && !input.checked) continue

    if (input.tagName === 'INPUT') {
      value = parseInputInputValue<T[keyof T]>(input)
    }

    if (input.tagName === 'SELECT') {
      value = parseSelectInputValue<T[keyof T]>(input)
    }

    data[fieldName as keyof T] = value
  }

  return data as FormValues<T>
}
