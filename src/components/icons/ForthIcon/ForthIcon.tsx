import { Component, JSX } from 'solid-js'

type ForthIconComponent = Component<JSX.IntrinsicElements['svg']>

export const ForthIcon: ForthIconComponent = props => {
  return (
    <svg
      class="svg-icon"
      viewBox="0 0 24 24"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <defs />
      <path d="M 8.0004825,3.4926034 15.438551,11.661871 7.9980335,20.507405" />
    </svg>
  )
}
