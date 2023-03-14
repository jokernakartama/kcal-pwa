import classNames from 'classnames'
import {
  ParentProps,
  JSX,
  splitProps,
  Signal,
  createEffect,
  on,
  createMemo
} from 'solid-js'
import { createPagination, FetchFunction } from '../../../hooks/createPagination'
import { ExtractPaginationDataType } from '../../../types/utils'
import styles from './styles.sass'

type PageScrollComponent = <T>(props: ParentProps<
JSX.IntrinsicElements['div'] & {
  /** A function that gets paginated response */
  fetch: FetchFunction<T>
  /**
   * Items list signal
   */
  signal: Signal<T[] | undefined>
}>) => JSX.Element

/**
 * Implements an infinite scroll. Updates items list according pagination state.
 */
export const PageScroll: PageScrollComponent = (props) => {
  let containerElement: HTMLDivElement | undefined
  const [local, rest] = splitProps(
    props,
    ['ref', 'signal', 'fetch', 'class', 'onScroll']
  )
  const [items, setItems] = local.signal
  const [
    fetchItems,
    { total, offset, limit }
  ] = createPagination<ExtractPaginationDataType<Awaited<typeof local.fetch>>>(
    props.fetch
  )
  const isNextPageAvailable = createMemo(() => {
    return typeof total() === 'undefined' || limit() + offset() <= total()!
  })

  /**
   * Replaces or adds items
   */
  function updateItems(nextItems: ReturnType<typeof items>, reset = false) {
    setItems(v =>
      v && !reset
        ? v.concat(nextItems!)
        : nextItems
    )
  }

  /**
   * Fetches the current slice of items
   * @param {number} take - Page limit
   */
  function fetchCurrentPages(take: number) {
    return fetchItems({ offset: 0, limit: take }, false)
      .then(value => updateItems(value as ReturnType<typeof items>, true))
  }

  /**
   * Fetches the items of the next page
   */
  function fetchNextPage() {
    return Promise.resolve()
      .then(() => {
        if (isNextPageAvailable()) {
          return fetchItems('next')
            .then(value => updateItems(value as ReturnType<typeof items>))
        }

        return Promise.resolve()
      })
  }

  /**
   * Used to fetch the initial page and reset meta
   */
  function fetchInitialPage() {
    return Promise.resolve()
      .then(() => {
        if (typeof items() === 'undefined') {
          return fetchItems({ offset: 0 }, true)
            .then(value => updateItems(value as ReturnType<typeof items>, true))
        }

        return Promise.resolve()
      })
  }

  /**
   * Used to fetch next pages in case if the current ones do not fill
   * the container completely (as the container has to be scrollable to get
   * next pages).
   */
  function fetchOtherPages(): Promise<void> | void {
    if (
      isNextPageAvailable() &&
      containerElement &&
      containerElement.clientHeight >= containerElement.scrollHeight
    ) {
      return fetchNextPage()
        .then(() => {
          return fetchOtherPages()
        })
    }

    return undefined
  }

  function handleScroll(
    e: UIEvent & { currentTarget: HTMLDivElement; target: Element }
  ) {
    const element = e.currentTarget

    if (!element) return

    if (element.scrollTop >= (element.scrollHeight - element.offsetHeight) * 0.8) {
      fetchNextPage()
        .catch(console.error)
    }

    if (typeof local.onScroll === 'function') {
      local.onScroll(e)
    }
  }

  function handleRefSet(el: HTMLDivElement) {
    containerElement = el

    if (typeof local.ref === 'function') {
      local.ref(el)
    } else {
      local.ref = el
    }
  }

  createEffect(on(items, (current, previous) => {
    if (!current) {
      fetchInitialPage()
        .then(fetchOtherPages)
        .catch(console.error)
    } else if (current && previous && current.length < previous.length) {
      fetchCurrentPages(previous.length)
        .catch(console.error)
    }
  }))

  return (
    <div
      ref={handleRefSet}
      class={classNames(styles.wrapper, local.class)}
      onScroll={handleScroll}
      {...rest}
    >
      {props.children}
    </div>
  )
}
