import { useEffect, useRef, useState, type CSSProperties, type MouseEvent, type ReactNode } from 'react'

const navItems = [
  ['About', '#about'],
  ['Work', '#work'],
  ['Experience', '#experience'],
  ['Building', '#building'],
  ['Contact', '#contact'],
] as const

const courses = [
  ['MTH 141', 'College Calculus I'], ['MTH 142', 'College Calculus II'],
  ['MTH 241', 'College Calculus III'], ['MTH 306', 'Differential Equations'],
  ['MTH 309', 'Linear Algebra'], ['MTH 311', 'Higher Mathematics'],
  ['MTH 337', 'Scientific & Math Computing'], ['MTH 353', 'Combinatorics I'],
  ['MTH 411', 'Probability Theory'], ['MTH 417', 'Multivariable Calculus'],
  ['MTH 418', 'Partial Differential Equations'], ['MTH 437', 'Numerical Analysis I'],
  ['MTH 450', 'Network Theory'], ['MTH 455', 'Complex Systems'],
  ['CSE 116', 'Computer Science II'], ['CSE 191', 'Discrete Structures'],
  ['CSE 220', 'Systems Programming'], ['CSE 241', 'Digital Systems'],
  ['CSE 250', 'Data Structures'],
]

const deployments = [
  { name: 'Viridian', note: 'Parent studio — systems for auto shops', url: 'https://viridian.cwmccann.pro', label: 'viridian.cwmccann.pro' },
  { name: 'Seneca Falls Self Storage', note: 'Self storage — units, access, enquiries', url: 'https://senecafallsselfstorage.com', label: 'senecafallsselfstorage.com' },
  { name: 'Buffalo Tailor', note: 'Alterations, bespoke suits, wedding attire', url: 'https://buffalo-tailor.vercel.app', label: 'buffalo-tailor.vercel.app' },
  { name: 'White Dog Vintage', note: 'Vintage retail and inventory', url: 'https://white-dog-vintage.vercel.app', label: 'white-dog-vintage.vercel.app' },
  { name: 'WQIS', note: 'Welding qualification & inspection services', url: 'https://wqis.vercel.app', label: 'wqis.vercel.app' },
  { name: 'Underhill Farms', note: 'Country inn and farm stay, Kansas', url: 'https://underhill-farms-country-inn.vercel.app', label: 'underhill-farms-country-inn.vercel.app' },
]

function PublicationRule({ label }: { label?: string }) {
  return <div className="publication-rule" aria-hidden="true"><span>{label}</span></div>
}

function SectionBanner({ label, className = '' }: { label: string; className?: string }) {
  return <header className={`section-banner ${className}`}>
    <span>{label}</span>
  </header>
}

function Metadata({ label, children }: { label: string; children: ReactNode }) {
  return <div className="metadata"><dt>{label}</dt><dd>{children}</dd></div>
}

function HeroCover({ decorative = false }: { decorative?: boolean }) {
  return <div className="hero-front" aria-hidden={decorative || undefined}>
    <div className="hero-media">
      <picture>
        <source media="(max-width: 640px)" srcSet="/assets/hero-editorial-mobile-v2.jpg" />
        <img src="/assets/hero-editorial-v2.jpg" alt={decorative ? '' : 'A painted suburban morning: a young man trims a long privet hedge beside a charcoal warehouse-style apartment, with a black Infiniti Q50 Sport parked in the driveway.'} />
      </picture>
      <div className="hero-print" aria-hidden="true" />
    </div>
    <div className="hero-statement">
      <h1>Driven to build.<br />Sustained by <em>curiosity.</em></h1>
    </div>
    <div className="scroll-cue"><span>Fold to explore</span><i /></div>
  </div>
}

function ConfuzedMark() {
  return <svg className="confuzed-mark" viewBox="0 0 120 120" aria-hidden="true">
    <circle cx="60" cy="64" r="52" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 7" opacity=".5" />
    <circle cx="60" cy="64" r="42" fill="none" stroke="currentColor" strokeWidth="1" opacity=".22" />
    <path d="M53 20c0-4.2 3.3-6.8 7.3-6.8s7 2.5 7 6.1c0 4.7-6.3 4.7-6.3 9.4" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
    <circle cx="61" cy="33" r="1.8" fill="currentColor" />
    <rect x="34" y="42" width="52" height="44" rx="15" fill="none" stroke="currentColor" strokeWidth="2.8" />
    <circle cx="49" cy="60" r="3.4" fill="currentColor" />
    <path d="M66 61.5c2.1-2.8 5.4-2.8 7.5 0" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
    <path d="M46 74c3.5-4 7-4 10.5 0s7 4 10.5 0" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
    <circle cx="60" cy="106" r="3" fill="currentColor" />
  </svg>
}

function Artifact({ kind }: { kind: 'confuzed' }) {
  if (kind === 'confuzed') {
    return <div className="artifact artifact-confuzed" aria-label="Identity mark and figures for the Confuzed Guy channel">
      <span className="artifact-kicker">Channel / autonomous</span>
      <ConfuzedMark />
      <div className="confuzed-figures">
        <div><b>189</b><span>Followers, YouTube + TikTok</span></div>
        <div><b>0</b><span>Humans in the loop</span></div>
        <div><b>↑</b><span>Growing, unattended</span></div>
      </div>
    </div>
  }
  return null
}

function App() {
  const stageRef = useRef<HTMLElement>(null)
  const [fold, setFold] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mobile = window.matchMedia('(max-width: 780px)')
    const closeOnDesktop = () => { if (!mobile.matches) setMenuOpen(false) }
    mobile.addEventListener('change', closeOnDesktop)
    return () => mobile.removeEventListener('change', closeOnDesktop)
  }, [])

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updateMotion = () => setReducedMotion(motion.matches)
    updateMotion()
    motion.addEventListener('change', updateMotion)

    let raf = 0
    const update = () => {
      raf = 0
      const stage = stageRef.current
      if (!stage) return
      const distance = Math.max(stage.offsetHeight - window.innerHeight, 1)
      const raw = Math.min(Math.max(-stage.getBoundingClientRect().top / distance, 0), 1)
      setFold(raw)
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      motion.removeEventListener('change', updateMotion)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.target.classList.toggle('is-in-view', entry.isIntersecting))
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' })
    document.querySelectorAll('[data-reveal]').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') setMenuOpen(false) }
    window.addEventListener('keydown', onKey)
    document.body.classList.toggle('menu-open', menuOpen)
    return () => { window.removeEventListener('keydown', onKey); document.body.classList.remove('menu-open') }
  }, [menuOpen])

  const progress = Math.min(fold / 0.9, 1)
  const crease = Math.min(progress / 0.62, 1)
  const creaseEase = (1 - Math.cos(crease * Math.PI)) / 2
  const lift = Math.max((progress - 0.62) / 0.38, 0)
  const liftEase = lift * lift * (3 - 2 * lift)
  const heroStyle = {
    '--fold-progress': progress,
    '--fold-angle': `${reducedMotion ? 0 : creaseEase * 180}deg`,
    '--fold-shade': reducedMotion ? 0 : Math.sin(creaseEase * Math.PI),
    '--paper-lift': `${reducedMotion ? 0 : -62 * liftEase}%`,
    '--paper-opacity': reducedMotion && fold > 0.08 ? 0 : 1,
    '--paper-events': progress >= 1 || (reducedMotion && fold > 0.08) ? 'none' : 'auto',
    '--crease-opacity': reducedMotion ? 0 : Math.sin(progress * Math.PI) * 0.5,
  } as CSSProperties

  const closeMenu = () => setMenuOpen(false)
  const navigateToSection = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    closeMenu()
    if (href !== '#about' || !stageRef.current) return
    event.preventDefault()
    const stage = stageRef.current
    window.history.pushState(null, '', href)
    window.scrollTo({
      top: stage.offsetTop + Math.max(stage.offsetHeight - window.innerHeight, 0) * 0.9,
      behavior: reducedMotion ? 'auto' : 'smooth',
    })
  }

  return <>
    <header className="site-navbar">
      <a className="nav-brand" href="#top" onClick={closeMenu} aria-label="CWM — back to top">CWM</a>
      <nav className="desktop-nav" aria-label="Main navigation">
        {navItems.map(([label, href]) => <a key={href} href={href} onClick={(event) => navigateToSection(event, href)}>{label}</a>)}
      </nav>
      <button className={`menu-toggle ${menuOpen ? 'is-open' : ''}`} onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-controls="site-index">
        <span>{menuOpen ? 'Close index' : 'Open index'}</span><i /><i />
      </button>
    </header>
    <div className={`menu-sheet ${menuOpen ? 'is-open' : ''}`} id="site-index" aria-hidden={!menuOpen}>
      <nav aria-label="Site sections">
        {navItems.map(([label, href]) => <a key={href} href={href} onClick={(event) => navigateToSection(event, href)}>{label}</a>)}
      </nav>
      <p>Buffalo, New York<br />42.8864° N / 78.8784° W</p>
    </div>

    <section className="fold-stage" ref={stageRef} id="top" style={heroStyle}>
      <div className="fold-viewport">
        <section className="about-underpage paper-surface" id="about" aria-labelledby="about-title">
          <SectionBanner label="About" className="page-folio" />
          <div className="about-grid">
            <div className="about-heading">
              <h2 id="about-title">Curiosity, made <em>practical.</em></h2>
            </div>
            <div className="about-copy">
              <p className="dropcap">Highly motivated professional with a foundation in mathematics through education, computer science through building applications, and information technology through hands-on professional experience. Interested in automation across technology, business, and finance, building practical solutions that improve how people and organizations operate.</p>
            </div>
            <dl className="about-index">
              <Metadata label="Currently">IT Analyst<br />Roswell Park</Metadata>
              <Metadata label="Based in">Buffalo, New York</Metadata>
              <Metadata label="Education">Applied Mathematics<br />Computer Science Minor</Metadata>
              <Metadata label="Focus">Helping small businesses strengthen their online presence</Metadata>
            </dl>
          </div>
          <div className="about-footnote">Curiosity → understanding → creation</div>
        </section>

        <div className="newspaper-sheet">
          <div className="newspaper-top">
            <HeroCover />
          </div>
          <div className="newspaper-flap" aria-hidden="true">
            <div className="paper-face newspaper-front"><HeroCover decorative /></div>
            <div className="paper-face newspaper-back">
              <div className="newsprint-columns"><i /><i /><i /><i /><i /><i /></div>
            </div>
          </div>
          <div className="newspaper-crease" aria-hidden="true" />
        </div>
        <div className="fold-shadow" aria-hidden="true" />
      </div>
    </section>

    <main>
      <section className="editorial-section work-section" id="work" aria-labelledby="work-title">
        <SectionBanner label="Selected work" />
        <div className="section-masthead" data-reveal>
          <h2 id="work-title">Documents from an<br /><em>active archive.</em></h2>
          <p>Four ongoing projects: a website design agency, a personal control layer, a media pipeline, and the channel that pipeline operates on its own.</p>
        </div>
        <PublicationRule />

        <article className="project-feature project-viridian" data-reveal>
          <div className="project-copy">
            <div className="project-status">Ongoing</div>
            <h3><a href="https://onyx.cwmccann.pro" target="_blank" rel="noreferrer">Onyx Studios</a></h3>
            <p>My website design agency, helping small businesses strengthen their online presence with thoughtfully designed websites and practical digital tools.</p>
            <a className="project-site-link" href="https://onyx.cwmccann.pro" target="_blank" rel="noreferrer">onyx.cwmccann.pro <span aria-hidden="true">↗</span></a>
            <ul className="tech-list" aria-label="Technologies"><li>TanStack Start</li><li>React</li><li>Cloudflare</li><li>CRM</li><li>Automation</li></ul>
          </div>
          <div className="deploy-index">
            <PublicationRule label="Selected deployments" />
            <div className="deploy-list">
              {deployments.map((entry) => (
                <a key={entry.url} href={entry.url} target="_blank" rel="noreferrer">
                  <b>{entry.name}</b>
                  <span className="deploy-note">{entry.note}</span>
                  <span className="deploy-url">{entry.label}</span>
                  <i aria-hidden="true">↗</i>
                </a>
              ))}
            </div>
          </div>
        </article>

        <article className="project-feature project-ctrl" data-reveal>
          <div className="project-copy">
            <div className="project-status">Personal system</div>
            <h3>Ctrlpanel</h3>
            <p>An AI-powered Life OS and personal control center. Every project reports into one surface—status, automation runs, and the small set of switches that actually change what happens next.</p>
            <ul className="tech-list" aria-label="Technologies"><li>React</li><li>Supabase</li><li>Cloudflare Workers</li><li>Claude AI</li></ul>
          </div>
          <a className="ctrl-screenshot" href="/assets/ctrlpanel-opportunities.png" target="_blank" rel="noreferrer" aria-label="View full-size Ctrlpanel screenshot">
            <img src="/assets/ctrlpanel-opportunities.png" alt="Ctrlpanel Opportunities Agent showing ranked career opportunities, skills to build, and a sidebar for projects, CRM, and personal tools." width="1709" height="957" loading="lazy" />
          </a>
          <p className="figure-caption">Ctrlpanel in use: the Opportunities Agent surfaces relevant opportunities and skills to build.</p>
        </article>

        <article className="project-feature project-engine" data-reveal>
          <div className="project-copy">
            <div className="project-status">Still developing</div>
            <h3>Content Engine</h3>
            <p>An AI-powered content platform in development for YouTube, X, TikTok, and other social channels. Designed to bring content creation and publishing into one workflow, helping build channels and brands through consistent content and organic marketing.</p>
            <ul className="tech-list" aria-label="Technologies"><li>Python</li><li>ElevenLabs</li><li>Gemini</li><li>FFmpeg</li></ul>
          </div>
        </article>

        <article className="project-feature project-confuzed" data-reveal>
          <Artifact kind="confuzed" />
          <div className="project-copy">
            <div className="project-status">Live channel</div>
            <h3>Confuzed Guy</h3>
            <p>The Content Engine pointed at a real audience. Scripting, voice, edit, thumbnail, and posting all run unattended—189 followers across YouTube and TikTok, fully automated and still climbing.</p>
            <ul className="tech-list" aria-label="Technologies"><li>YouTube</li><li>TikTok</li><li>Scheduled publishing</li><li>Content Engine</li></ul>
          </div>
          <p className="figure-caption">A channel that runs whether or not anyone is watching it.</p>
        </article>
      </section>

      <section className="editorial-section archive-section" id="experience" aria-labelledby="experience-title">
        <SectionBanner label="Experience & study" />
        <div className="section-masthead compact" data-reveal>
          <h2 id="experience-title">A chronological<br /><em>working record.</em></h2>
        </div>
        <div className="archive-layout">
          <aside className="archive-margin" data-reveal>
            <span>PROFESSIONAL RECORD</span>
            <p>Work across healthcare, higher education, and live events—different environments joined by systems that must hold up in practice.</p>
          </aside>
          <div className="timeline">
            <article className="timeline-entry" data-reveal>
              <time>JAN 2026 — PRESENT</time>
              <div><h3>IT Analyst</h3><p className="organization">Roswell Park Comprehensive Cancer Center</p><p>Power BI reporting and Epic EHR / identity support in a healthcare environment.</p></div>
            </article>
            <article className="timeline-entry" data-reveal>
              <time>SEP 2022 — DEC 2025</time>
              <div><h3>Senior Information Technology Technician</h3><p className="organization">University at Buffalo</p><p>L2 escalation point across two ticketing systems; trained consultants and standardized support delivery.</p></div>
            </article>
            <article className="timeline-entry" data-reveal>
              <time>APR 2025 — NOV 2025</time>
              <div><h3>Venue IT Support</h3><p className="organization">Live Nation Entertainment</p><p>On-site IT leadership for live events—networking, POS, and digital signage end to end.</p></div>
            </article>
          </div>
        </div>

        <div className="education-spread" data-reveal>
          <div className="education-title"><span>ACADEMIC RECORD / SEP 2021 — DEC 2025</span><h3>Computational &amp; Applied Mathematics</h3><p>Computer Science Minor<br />University at Buffalo</p></div>
          <details className="coursework">
            <summary><span>Coursework index</span><b>19 entries</b><i>+</i></summary>
            <div className="course-grid">
              {courses.map(([code, name]) => <div key={code}><span>{code}</span><p>{name}</p></div>)}
            </div>
          </details>
        </div>

        <div className="continued-study" data-reveal>
          <div><span>CONTINUED STUDY</span><p>Learning remains part of the work, not a footnote after it.</p></div>
          <ul>
            <li><b>Claude Academy: Claude 101</b><span>Anthropic</span><em>Completed · Oct 2026</em></li>
            <li><b>AI Agents and LLM Automation</b><span>Udemy</span><em>Completed · Jul 2026</em></li>
            <li><b>Theory of Credit Risk Models</b><span>Udemy</span><em>Completed · Jul 2026</em></li>
            <li><b>ITIL 4 Foundations</b><span>Udemy · UC-6f7df76a</span><em>Completed · Feb 2026</em></li>
            <li><b>Lean Six Sigma White Belt</b><span>Aveta Business Institute</span><em>Completed · Apr 2025</em></li>
            <li><b>Exam FM — Financial Mathematics</b><span>Society of Actuaries</span><em>In progress</em></li>
          </ul>
        </div>
      </section>

      <section className="building-section" id="building" aria-labelledby="building-title">
        <SectionBanner label="Building" />
        <div className="building-inner" data-reveal>
          <h2 id="building-title">See what I’ve<br />been <em>building.</em></h2>
          <p>Follow my projects, experiments, and work in progress on X.</p>
          <a className="building-link" href="https://x.com/cwm__3" target="_blank" rel="noreferrer"><span>Follow along on X</span><b>@cwm__3</b><i aria-hidden="true">↗</i></a>
        </div>
      </section>
    </main>

    <footer id="contact" className="colophon">
      <SectionBanner label="Contact" />
      <div className="colophon-top"><p>For thoughtful work, practical systems,<br />or an interesting question.</p></div>
      <div className="contact-links">
        <a href="mailto:cwm@cwmccann.pro"><span>Email</span><b>cwm@cwmccann.pro</b><i>→</i></a>
        <a href="tel:+13153981228"><span>Phone</span><b>(315) 398-1228</b><i>→</i></a>
        <a href="https://www.linkedin.com/in/cwmccannpro/" target="_blank" rel="noreferrer"><span>LinkedIn</span><b>/in/cwmccannpro</b><i>↗</i></a>
        <a href="https://github.com/cwmccannpro" target="_blank" rel="noreferrer"><span>GitHub</span><b>@cwmccannpro</b><i>↗</i></a>
      </div>
      <div className="colophon-bottom"><b>Cameron W. McCann</b><span>Buffalo, New York</span><span>© 2026</span><a href="#top">Return to top ↑</a></div>
    </footer>
  </>
}

export default App
