import SiteNav from './SiteNav'
import XTimeline from './XTimeline'

export default function Notes() {
  return <>
    <SiteNav />
    <main className="notes-page paper-surface" id="notes">
      <header className="section-banner"><span>Notes</span></header>
      <div className="notes-heading">
        <h1>From the <em>notebook.</em></h1>
        <p>Projects, experiments, and ideas as they take shape.</p>
      </div>
      <section className="notes-layout" aria-label="Latest notes">
        <aside className="notes-margin">
          <span>Written along the way</span>
          <p>What I’m building, what I’m learning, and the ideas worth keeping.</p>
          <a href="/#work">Explore the projects <span aria-hidden="true">→</span></a>
        </aside>
        <XTimeline />
      </section>
      <footer className="notes-footer">
        <span>Cameron W. McCann · © {new Date().getFullYear()}</span>
        <a href="/">Back to the portfolio <span aria-hidden="true">←</span></a>
      </footer>
    </main>
  </>
}
