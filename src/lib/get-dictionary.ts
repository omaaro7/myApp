
import type { Locale } from '@/i18n-config'

const dictionaries = {
  en: () => import('@/dictionaries/en.json', { with: { type: 'json' } }).then((module) => module.default),
  ar: () => import('@/dictionaries/ar.json', { with: { type: 'json' } }).then((module) => module.default),
}

export const getDictionary = async (locale: Locale) => dictionaries[locale]()
