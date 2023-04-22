export type FormSubmitEvent = Event & { currentTarget: HTMLFormElement }

export type FormValues<T extends object> = {
  [P in keyof T]: T[P]
}

export type FormValidity<T extends object> = {
  [P in keyof T]: ValidityState
}

export type FormContextData<T extends object> = {
  [P in keyof T]?: {
    value: T[P]
    valid: boolean
    validity: ValidityState
  }
}

export type FormContextType<
  T extends FormValues<T> = FormValues<object>
> = FormContextData<T>
