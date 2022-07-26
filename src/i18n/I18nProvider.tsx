import i18next, { i18n, StringMap, TOptions } from 'i18next'
import { Component, createContext, ParentComponent, useContext } from 'solid-js'

type TFunction = <TInterpolationMap extends object = StringMap>(
  /**
   * Translation key
   */
  key: string,
  /**
   * Translation options (only basic usage)
   * @see {@link https://www.i18next.com/overview/api#t}
   */
  options?: TOptions<TInterpolationMap> | string
) => string

const I18nContext = createContext<i18n>(i18next)

export const useI18n = () => useContext(I18nContext)

/**
 * Returns a translation function for basic usage
 * @returns {TFunction}
 */
export const useT = (): TFunction => {
  const i18nContext = useContext(I18nContext)
  return (key, options) => {
    const translation = i18nContext.t(key, options)

    if (typeof translation !== 'string') return key ?? ''

    return translation
  }
}

/**
 * A component that provides i18n context
 */
export const I18nProvider: ParentComponent = props => {
  return (
    <I18nContext.Provider value={i18next}>
      {props.children}
    </I18nContext.Provider>
  )
}
