import { useTranslation } from 'react-i18next'
import { FooterLink } from '../types/footerLink.js'
import './Footer.scss'

export function Footer() {
  const { t } = useTranslation()

  const renderLink = (href, label) => (
    <a className="footer-link" href={href} target="_blank" rel="noreferrer">
      {label}
    </a>
  )

  return (
    <footer className="footer">
      {renderLink(FooterLink.GitHub, t('footer.github'))}
      <span className="footer-author">
        {renderLink(FooterLink.LinkedIn, t('footer.linkedin'))}
        {renderLink(FooterLink.Blog, t('footer.blog'))}
      </span>
    </footer>
  )
}
