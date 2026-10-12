import { useEffect, useRef, useState } from 'react'

const title = 'Network Analysis of High-Risk Recreational Drug Combinations'
const pages = [
  '/assets/academic-paper/page-01.jpg',
  '/assets/academic-paper/page-02.png',
  '/assets/academic-paper/page-03.png',
  '/assets/academic-paper/page-04.png',
  '/assets/academic-paper/page-05.jpg',
  '/assets/academic-paper/page-06.png',
]

export default function AcademicPaper() {
  const [selectedPage, setSelectedPage] = useState<number | null>(null)
  const [enlarged, setEnlarged] = useState(false)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const isOpen = selectedPage !== null

  useEffect(() => {
    const dialog = dialogRef.current
    if (!isOpen || !dialog) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialog.showModal()
    return () => {
      dialog.close()
      document.body.style.overflow = previousOverflow
    }
  }, [isOpen])

  const turnPage = (direction: number) => {
    setSelectedPage((page) => page === null ? null : Math.max(0, Math.min(pages.length - 1, page + direction)))
  }

  return <>
    <section className="academic-paper" aria-labelledby="academic-paper-title" data-reveal>
      <div className="academic-paper-heading">
        <div>
          <span className="academic-paper-label">Academic paper</span>
          <h3 id="academic-paper-title">{title}</h3>
        </div>
        <p>University at Buffalo · April 2025<br />Six pages · Select a page to read</p>
      </div>
      <div className="paper-pages">
        {pages.map((src, index) => (
          <button key={src} type="button" aria-label={`Read academic paper, page ${index + 1}`} aria-haspopup="dialog" onClick={() => { setEnlarged(false); setSelectedPage(index) }}>
            <img src={src} alt={`Academic paper — page ${index + 1}`} width="994" height="1287" loading="lazy" />
          </button>
        ))}
      </div>
    </section>

    <dialog className="paper-viewer" ref={dialogRef} aria-labelledby="paper-viewer-title"
      onCancel={() => setSelectedPage(null)} onClose={() => setSelectedPage(null)}
      onClick={(event) => { if (event.target === event.currentTarget) setSelectedPage(null) }}
      onKeyDown={(event) => {
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
          event.preventDefault()
          turnPage(event.key === 'ArrowLeft' ? -1 : 1)
        }
      }}>
      <div className="paper-viewer-content">
        <header className="paper-viewer-header">
          <div>
            <h2 id="paper-viewer-title">{title}</h2>
            <p aria-live="polite" aria-atomic="true">Page {(selectedPage ?? 0) + 1} of {pages.length}</p>
          </div>
          <div className="paper-viewer-controls">
            <button type="button" className="paper-close" aria-label="Enlarge page" aria-pressed={enlarged} onClick={() => setEnlarged(!enlarged)}>{enlarged ? 'Fit page' : 'Enlarge'}</button>
            <button type="button" className="paper-close" autoFocus onClick={() => setSelectedPage(null)} aria-label="Close academic paper">Close <span aria-hidden="true">×</span></button>
          </div>
        </header>
        <div className="paper-viewer-stage">
          <button type="button" className="paper-turn" aria-label="Previous page" disabled={selectedPage === 0} onClick={() => turnPage(-1)}><span aria-hidden="true">←</span></button>
          <div key={selectedPage} className={`paper-viewer-image${enlarged ? ' is-enlarged' : ''}`}>
            {selectedPage !== null && <img src={pages[selectedPage]} alt={`${title} — page ${selectedPage + 1}`} width="994" height="1287" />}
          </div>
          <button type="button" className="paper-turn" aria-label="Next page" disabled={selectedPage === pages.length - 1} onClick={() => turnPage(1)}><span aria-hidden="true">→</span></button>
        </div>
      </div>
    </dialog>
  </>
}
