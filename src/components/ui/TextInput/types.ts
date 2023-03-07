export type TextInputTypeValue =
  | 'password'
  | 'text'
  | 'date'
  | 'email'
  | 'number'
  | 'search'
  | 'tel'
  | 'url'

export type TextInputChangeEvent = InputEvent & {
  currentTarget: HTMLInputElement
  target: HTMLInputElement
}
