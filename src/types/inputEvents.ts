export type InputChangeEvent<Input = HTMLInputElement> = InputEvent & {
  /**
   * It is more safe to use `target` to get the value, because `currentTarget`
   * is empty when the event is dispatched by clearing the field
   */
  currentTarget: Input
  target: Input
}
