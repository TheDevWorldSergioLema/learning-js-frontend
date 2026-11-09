import { ButtonVariant } from '../../types/buttonVariant.js'
import './Button.scss'

export function Button({ variant = ButtonVariant.Secondary, className, ...props }) {
  const classes = ['button', `button-${variant}`, className].filter(Boolean).join(' ')

  return <button type="button" className={classes} {...props} />
}
