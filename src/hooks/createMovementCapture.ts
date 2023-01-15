import { batch, createSignal } from 'solid-js'

interface MovementCaptureHookOptions {
  /**
   * Whether X axis calculations should be processed. Default: true.
   */
  x?: boolean
  /**
   * Whether Y axis calculations should be processed. Default: true.
   */
  y?: boolean
}

/**
 * Provides methods and props to track element movement within document
 * relatively to its current position
 * @param {Object} [options]
 * @param {boolean} [options.x = true] - Whether X axis should be tracked
 * @param {boolean} [options.y = true] - Whether Y axis should be tracked
 * @returns {Object}
 */
export function createMovementCapture(options?: MovementCaptureHookOptions) {
  let capturedX: number | undefined
  let capturedY: number | undefined
  const [currentY, setCurrentY] = createSignal<number | undefined>()
  const [currentX, setCurrentX] = createSignal<number | undefined>()

  const [isCaptured, setIsCaptured] = createSignal<boolean>(false)

  const calcOptions = options ?? { x: true, y: true }

  function getCurrentX(pageX: number, captured: number) {
    const leftValue = pageX - (captured ?? 0)

    return leftValue
  }

  function getCurrentY(pageY: number, captured: number) {
    const topValue = pageY - (captured ?? 0)

    return topValue
  }

  function captureCoordinates(
    pageX: number,
    pageY: number,
    element: HTMLElement
  ) {
    batch(() => {
      if (calcOptions.x !== false) {
        const nextCapturedX = pageX - (element?.offsetLeft ?? 0)
        capturedX = nextCapturedX
        setCurrentX(getCurrentX(pageX, nextCapturedX))
      }

      if (calcOptions.y !== false) {
        const nextCapturedY = pageY - (element?.offsetTop ?? 0)
        capturedY = nextCapturedY
        setCurrentY(getCurrentY(pageY, nextCapturedY))

      }

      setIsCaptured(true)
    })
  }

  function hold(e: MouseEvent) {
    const element = e.currentTarget as HTMLElement
    captureCoordinates(e.pageX, e.pageY, element)

    window.document.addEventListener('mousemove', move)
    window.document.addEventListener('mouseup', release)
  }

  function move(e: MouseEvent) {
    batch(() => {
      if (calcOptions.x !== false) {
        setCurrentX(getCurrentX(e.pageX, capturedX ?? 0))
      }
      if (calcOptions.y !== false) {
        console.info(e.pageY, capturedY)
        setCurrentY(getCurrentY(e.pageY, capturedY ?? 0))
      }
    })
  }

  function touch(e: TouchEvent) {
    if (!e.touches[0]) return

    const element = e.currentTarget as HTMLElement
    const { pageX, pageY } = e.touches[0]

    captureCoordinates(pageX, pageY, element)

    window.document.addEventListener('touchmove', slide)
    window.document.addEventListener('touchend', release)
  }

  function slide(e: TouchEvent) {
    if (!e.touches[0]) return
    const { pageX, pageY } = e.touches[0]

    batch(() => {
      if (calcOptions.x !== false) {
        setCurrentX(getCurrentX(pageX, capturedX ?? 0))
      }
      if (calcOptions.y !== false) {
        setCurrentY(getCurrentY(pageY, capturedY ?? 0))
      }
    })
  }

  function release() {
    window.document.removeEventListener('mouseup', release)
    window.document.removeEventListener('mousemove', move)
    window.document.removeEventListener('touchend', release)
    window.document.removeEventListener('touchmove', slide)

    batch(() => {
      if (calcOptions.x) {
        capturedX = undefined
      }
      if (calcOptions.y) {
        capturedY = undefined
      }

      setIsCaptured(false)
    })
  }

  return {
    hold,
    touch,
    isCaptured,
    x: currentX,
    y: currentY
  }
}
