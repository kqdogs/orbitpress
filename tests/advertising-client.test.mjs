import { afterEach, describe, expect, it, vi } from 'vitest';
import { initializeAdSlots } from '../src/lib/advertising-client';

afterEach(() => vi.unstubAllGlobals());
function fixture(ready = true) {
  const boxes = [100, 0, 200].map(width => ({ hidden: true, dataset: {}, getBoundingClientRect: () => ({ width }), querySelector: () => ({}) }));
  const events = new Map();
  const document = { documentElement: { dataset: { adsenseLoaded: ready ? '1' : '' } }, querySelector: () => boxes[0], querySelectorAll: () => boxes, addEventListener: (name, fn) => events.set(name, fn) };
  let callback;
  const unobserve = vi.fn(), disconnect = vi.fn(), observe = vi.fn();
  class Observer { constructor(fn) { callback = fn; } observe = observe; unobserve = unobserve; disconnect = disconnect; }
  const push = vi.fn();
  vi.stubGlobal('document', document); vi.stubGlobal('window', { adsbygoogle: { push }, addEventListener: (name, fn) => events.set(name, fn) });
  vi.stubGlobal('IntersectionObserver', Observer);
  return { boxes, events, push, observe, disconnect, fire: entries => callback(entries) };
}
describe('ad unit initialization without live advertising', () => {
  it('waits for the library and requests each visible, nonzero-width unit once', () => {
    const f = fixture(false);
    initializeAdSlots();
    expect(f.observe).not.toHaveBeenCalled(); expect(f.push).not.toHaveBeenCalled();
    f.events.get('orbitpress:adsense-ready')();
    expect(f.observe).toHaveBeenCalledTimes(3);
    f.fire(f.boxes.map(target => ({ target, isIntersecting: false })));
    expect(f.push).not.toHaveBeenCalled();
    f.fire(f.boxes.map(target => ({ target, isIntersecting: true })));
    expect(f.push).toHaveBeenCalledTimes(2);
    f.fire(f.boxes.map(target => ({ target, isIntersecting: true })));
    expect(f.push).toHaveBeenCalledTimes(2);
    expect(f.boxes[1].dataset.adRequested).toBeUndefined();
    f.events.get('pagehide')(); expect(f.disconnect).toHaveBeenCalledOnce();
  });
  it('hides a unit on library rejection and never retries the same impression', () => {
    const f = fixture();
    f.push.mockImplementation(() => { throw Error('blocked fixture'); });
    initializeAdSlots(); f.fire([{ target: f.boxes[0], isIntersecting: true }]);
    expect(f.boxes[0].hidden).toBe(true);
    f.fire([{ target: f.boxes[0], isIntersecting: true }]);
    expect(f.push).toHaveBeenCalledOnce();
  });
});
