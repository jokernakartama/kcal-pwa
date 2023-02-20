import { Component, JSX } from 'solid-js'

type BackIconComponent = Component<JSX.IntrinsicElements['svg']>

export const BackIcon: BackIconComponent = props => {
  return (
    <svg
      viewBox="0 0 24 24"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <defs />
      <path d="M 15.717801,3.4926034 8.2797325,11.661871 15.72025,20.507405" />
    </svg>
  )
}
