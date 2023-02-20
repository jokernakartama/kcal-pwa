import { Component, JSX } from 'solid-js'

type CancelIconComponent = Component<JSX.IntrinsicElements['svg']>

export const CancelIcon: CancelIconComponent = props => {
  return (
    <svg
      viewBox="0 0 24 24"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <defs />
      <path d="M 18.315703,5.4744963 5.66167,18.135404" />
      <path d="M 21.081316,12 A 9.081316,9.081316 0 0 1 12,21.081316 9.081316,9.081316 0 0 1 2.918684,12 9.081316,9.081316 0 0 1 12,2.918684 9.081316,9.081316 0 0 1 21.081316,12 Z" />
    </svg>
  )
}
