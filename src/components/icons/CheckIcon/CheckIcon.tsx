import { Component, JSX } from 'solid-js'

type CheckIconComponent = Component<JSX.IntrinsicElements['svg']>

export const CheckIcon: CheckIconComponent = props => {
  return (
    <svg
      class="svg-icon"
      viewBox="0 0 24 24"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <defs />
      <path d="M 21.714552,5.8497609 9.8305218,17.740244 3.3765628,11.358164" />
    </svg>
  )
}
