import { Component, JSX } from 'solid-js'

type CrossIconComponent = Component<JSX.IntrinsicElements['svg']>

export const CrossIcon: CrossIconComponent = props => {
  return (
    <svg
      viewBox="0 0 24 24"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <defs />
      <path d="M 19.810106,4.1856511 4.1898939,19.814349" />
      <path d="M 19.814349,19.810106 4.1856514,4.1898935" />
    </svg>
  )
}
