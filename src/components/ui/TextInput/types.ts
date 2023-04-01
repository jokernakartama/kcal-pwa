export type TextInputTypeValue =
  | 'password'
  | 'text'
  | 'date'
  | 'email'
  | 'number'
  | 'search'
  | 'tel'
  | 'url'

export type TextInputChangeEvent<Input = HTMLInputElement> = InputEvent & {
  currentTarget: Input
  target: Input
}
