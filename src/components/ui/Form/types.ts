export type FormSubmitEvent = Event & { currentTarget: HTMLFormElement }

export type FormValues<T = Record<string, never>> = {
  [P in keyof T]: T[P]
}
