import { useEffect, useState, type MouseEvent } from 'react'

const links = [
  ['About', '#about'],
  ['Work', '#work'],
  ['Experience', '#experience'],
  ['Notes', '/notes/'],
  ['Contact', '#contact'],
] as const

export default function SiteNav({ home = false, onSectionNavigate }: {
  home?: boolean
  onSectionNavigate?: (event: MouseEvent<HTMLAnchorElement>, href: string) => void
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const hrefFor = (href: string) => !home && href.startsWith('#') ? `/${href}` : href

  useEffect(() => {
    const mobile = window.matchMedia('(max-width: 780px)')
    const closeOnDesktop = () => { if (!mobile.matches) setMenuOpen(false) }
    mobile.addEventListener('change', closeOnDesktop)
    return () => mobile.removeEventListener('change', closeOnDesktop)
  }, [])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') setMenuOpen(false) }
    window.addEventListener('keydown', onKey)
    document.body.classList.toggle('menu-open', menuOpen)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.classList.remove('menu-open')
    }
  }, [menuOpen])

  const navigate = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    setMenuOpen(false)
    onSectionNavigate?.(event, href)
  }

  const navLinks = links.map(([label, href]) => (
    <a key={href} href={hrefFor(href)} aria-current={!home && label === 'Notes' ? 'page' : undefined}
      onClick={(event) => navigate(event, href)}>{label}</a>
  ))

  return <>
    <header className="site-navbar">
      <a className="nav-brand" href={hrefFor('#top')} onClick={() => setMenuOpen(false)} aria-label="CWM — back to top">CWM</a>
      <nav className="desktop-nav" aria-label="Main navigation">{navLinks}</nav>
      <button className={`menu-toggle ${menuOpen ? 'is-open' : ''}`} onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-controls="site-index">
        <span>{menuOpen ? 'Close index' : 'Open index'}</span><i /><i />
      </button>
    </header>
    <div className={`menu-sheet ${menuOpen ? 'is-open' : ''}`} id="site-index" aria-hidden={!menuOpen}>
      <nav aria-label="Site sections">{navLinks}</nav>
      <p>Buffalo, New York<br />42.8864° N / 78.8784° W</p>
    </div>
  </>
}
