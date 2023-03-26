import { Component, JSX } from 'solid-js'

type PlusIconComponent = Component<JSX.IntrinsicElements['svg']>

export const PlusIcon: PlusIconComponent = props => {
  return (
    <svg
      class="svg-icon"
      viewBox="0 0 24 24"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <defs />
      <path d="M 12.003,21.403013 11.997,2.5969868" />
      <path d="m 2.596987,11.538431 18.806026,-0.006" />
    </svg>
  )
}
