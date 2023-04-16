export type InputChangeEvent<Input = HTMLInputElement> = InputEvent & {
  currentTarget: Input
  target: Input
}
