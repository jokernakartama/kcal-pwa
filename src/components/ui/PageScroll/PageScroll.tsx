import classNames from 'classnames'
import { createSignal, onMount, ParentComponent } from 'solid-js'
import { DEFAULT_LIST_PARAMS } from '../../../workers/db/constants'
import styles from './styles.sass'

type PageScrollComponent = ParentComponent<{
  class?: string
  /**
   * Whether the list is supposed to be scrolled to top
   */
  reverse?: boolean
  /**
   * Whether loading should be triggered initially
   */
  load?: boolean
  /**
   * Limit of records of one page
   */
  limit?: number
  /**
   * A callback that loads paginated records
   */
  onNextPage: (
    offset: number,
    limit: number
  ) => Promise<{ offset: number, limit: number, total: number }>
}>

/**
 * Implements infinite scroll
 */
export const PageScroll: PageScrollComponent = props => {
  const [offset, setOffset] = createSignal<number>(0)
  const [currentTotal, setCurrentTotal] = createSignal<number | undefined>()
  let isLoading = false

  const handlePageLoad = () => {
    const nextLimit = props.limit ?? DEFAULT_LIST_PARAMS.limit
    const nextOffset = offset() + nextLimit

    if (
      !isLoading &&
      (typeof currentTotal() === 'undefined' || nextOffset <= currentTotal()!)
    ) {
      isLoading = true
      props.onNextPage(nextOffset, nextLimit)
        .then(({ total }) => {
          setOffset(nextOffset)
          setCurrentTotal(total)
          isLoading = false
        })
        .catch(console.error)
    }
  }

  function handleScroll(e: UIEvent & { target: Element }) {
    const element = e.target as HTMLDivElement

    if (!element) return

    if (props.reverse) {
      if (element.scrollTop <= (element.scrollHeight - element.offsetHeight) * 0.6) {
        handlePageLoad()
      }
    }

    if (element.scrollTop >= (element.scrollHeight - element.offsetHeight) * 0.6) {
      handlePageLoad()
    }
  }

  onMount(() => {
    if (props.load) {
      handlePageLoad()
    }
  })

  return (
    <div
      class={classNames(styles.wrapper, props.class)}
      onScroll={handleScroll}
    >
      {props.children}
    </div>
  )
}
