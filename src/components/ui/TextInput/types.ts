export type TextInputTypeValue =
  | 'password'
  | 'text'
  | 'date'
  | 'email'
  | 'number'
  | 'search'
  | 'tel'
  | 'url'

export type TextInputChangeEvent = Event & {
  currentTarget: HTMLInputElement
  target: Element
}
