import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

/** The translated comments of the steps' code, stable until the language changes. */
export function useCodeComments() {
  const { t } = useTranslation()
  return useMemo(() => t('codeComments', { returnObjects: true }), [t])
}
