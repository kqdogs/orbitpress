interface AdQueue { push: (value: Record<string, never>) => unknown }
declare global { interface Window { adsbygoogle?: AdQueue } }

/** No requests until Google's script loads. Each visible unit is submitted at most once. */
export function initializeAdSlots() {
  if (!document.querySelector('[data-ad-placement]')) return;
  const start = () => {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        const box = entry.target as HTMLElement;
        if (!entry.isIntersecting || box.dataset.adRequested === '1' || box.getBoundingClientRect().width === 0) continue;
        const unit = box.querySelector('ins');
        if (!unit) continue;
        box.dataset.adRequested = '1';
        observer.unobserve(box);
        try {
          const pending: Record<string, never>[] = [];
          (window.adsbygoogle ||= pending).push({});
        }
        catch { box.hidden = true; }
      }
    }, { rootMargin: '160px' });
    for (const box of document.querySelectorAll<HTMLElement>('[data-ad-placement]')) {
      box.hidden = false;
      observer.observe(box);
    }
    window.addEventListener('pagehide', () => observer.disconnect(), { once: true });
  };
  if (document.documentElement.dataset.adsenseLoaded === '1') start();
  else document.addEventListener('orbitpress:adsense-ready', start, { once: true });
}
