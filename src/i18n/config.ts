import i18next from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import ChainedBackend from 'i18next-chained-backend'
import HttpBackend from 'i18next-http-backend'

export const i18n = i18next
  .use(ChainedBackend)
  .use(LanguageDetector)
  .init(
    {
      fallbackLng: 'en',
      preload: ['en', 'ru'],
      fallbackNS: false,
      detection: {
        order: ['querystring', 'navigator', 'htmlTag'],
        lookupQuerystring: 'lang'
      },
      backend: {
        backends: [HttpBackend],
        backendOptions: [
          {
            loadPath: '/locales/{{lng}}.json'
          }
        ]
      }
    },
    error => {
      if (error !== undefined) return console.warn(error)
      return undefined
    }
  )
