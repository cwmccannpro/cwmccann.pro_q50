import { useEffect, useRef, useState } from 'react'

type XWidgets = {
  widgets: {
    createTimeline: (
      source: { sourceType: 'profile'; screenName: string },
      target: HTMLElement,
      options: Record<string, string | number | boolean>,
    ) => Promise<HTMLElement | undefined>
  }
  ready: (callback: (api: XWidgets) => void) => void
}

declare global {
  interface Window { twttr?: XWidgets }
}

let widgetsPromise: Promise<XWidgets> | undefined

function loadWidgets() {
  if (window.twttr?.widgets) return Promise.resolve(window.twttr)
  if (widgetsPromise) return widgetsPromise

  widgetsPromise = new Promise<XWidgets>((resolve, reject) => {
    const timeout = window.setTimeout(() => reject(new Error('X widgets timed out')), 15000)
    const script = document.createElement('script')
    script.src = 'https://platform.twitter.com/widgets.js'
    script.async = true
    script.onload = () => {
      if (!window.twttr) {
        window.clearTimeout(timeout)
        reject(new Error('X widgets unavailable'))
        return
      }
      window.twttr.ready((api) => {
        window.clearTimeout(timeout)
        resolve(api)
      })
    }
    script.onerror = () => {
      window.clearTimeout(timeout)
      script.remove()
      reject(new Error('X widgets could not load'))
    }
    document.head.appendChild(script)
  }).catch((error: unknown) => {
    widgetsPromise = undefined
    throw error
  })

  return widgetsPromise
}

export default function XTimeline() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [state, setState] = useState<'loading' | 'ready' | 'unavailable'>('loading')
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    let cancelled = false
    let timeout = 0
    const target = document.createElement('div')
    container.replaceChildren(target)
    setState('loading')

    async function embed() {
      try {
        const api = await loadWidgets()
        if (cancelled) return
        const timeline = await Promise.race([
          api.widgets.createTimeline({ sourceType: 'profile', screenName: 'cwm__3' }, target, {
            theme: 'light', chrome: 'noheader nofooter noborders transparent',
            tweetLimit: 10, width: 680, dnt: true, lang: 'en',
          }),
          new Promise<undefined>((resolve) => {
            timeout = window.setTimeout(() => resolve(undefined), 15000)
          }),
        ])
        window.clearTimeout(timeout)
        if (cancelled) return
        if (!timeline) target.remove()
        setState(timeline ? 'ready' : 'unavailable')
      } catch (error: unknown) {
        console.warn('The Notes feed could not load.', error)
        if (!cancelled) setState('unavailable')
      }
    }

    void embed()
    return () => {
      cancelled = true
      window.clearTimeout(timeout)
      container.replaceChildren()
    }
  }, [attempt])

  return <div className="notes-feed">
    {state !== 'ready' && <div className="notes-feed-status" role="status">
      <p>{state === 'loading' ? 'Loading the latest notes…' : 'The X feed is unavailable right now.'}</p>
      {state === 'unavailable' && <button onClick={() => setAttempt((value) => value + 1)}>Try again</button>}
    </div>}
    <div ref={containerRef} className="notes-timeline" aria-label="Recent posts from Cameron McCann on X" />
    <a className="notes-source" href="https://x.com/cwm__3" target="_blank" rel="noreferrer">View posts on X <span aria-hidden="true">↗</span></a>
  </div>
}
