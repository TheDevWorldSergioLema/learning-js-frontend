import { useTranslation } from 'react-i18next'
import { MAX_ITERATIONS } from '../utils/runner.js'

/** Turns a `RunErrorInfo` into a sentence, with its line when known. */
export function useErrorText() {
  const { t } = useTranslation()

  return (error) => {
    const text = t(`errors.${error.type}`, { name: error.name, message: error.message, count: MAX_ITERATIONS })
    return error.line ? t('errors.atLine', { error: text, line: error.line }) : text
  }
}
