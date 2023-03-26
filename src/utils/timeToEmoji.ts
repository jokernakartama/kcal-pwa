import { emoji } from '../constants/emoji'

export function timeToEmoji(time: Date) {
  let hours = time.getHours() % 12 || 12
  const minutes = time.getMinutes()
  const isHalf = minutes > 15 && minutes < 45

  if (minutes > 45) hours += 1

  if (hours === 1) {
    if (isHalf) return emoji.oneThirtyOClock
    return emoji.oneOClock
  }

  if (hours === 2) {
    if (isHalf) return emoji.twoThirtyOClock
    return emoji.twoOClock
  }

  if (hours === 3) {
    if (isHalf) return emoji.threeThirtyOClock
    return emoji.threeOClock
  }

  if (hours === 4) {
    if (isHalf) return emoji.fourThirtyOClock
    return emoji.fourOClock
  }

  if (hours === 5) {
    if (isHalf) return emoji.fiveThirtyOClock
    return emoji.fiveOClock
  }

  if (hours === 6) {
    if (isHalf) return emoji.sixThirtyOClock
    return emoji.sixOClock
  }

  if (hours === 7) {
    if (isHalf) return emoji.sevenThirtyOClock
    return emoji.sevenOClock
  }

  if (hours === 8) {
    if (isHalf) return emoji.eightThirtyOClock
    return emoji.eightOClock
  }

  if (hours === 9) {
    if (isHalf) return emoji.nineThirtyOClock
    return emoji.nineOClock
  }

  if (hours === 10) {
    if (isHalf) return emoji.tenThirtyOClock
    return emoji.tenOClock
  }

  if (hours === 11) {
    if (isHalf) return emoji.elevenThirty
    return emoji.elevenOClock
  }

  if (hours === 12 && isHalf) return emoji.twelveThirtyOClock

  return emoji.twelveOClock
}
