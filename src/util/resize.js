// Modified from github.com/nolanlawson/pinafore

import debounce from 'lodash-es/debounce'

const DEBOUNCE_DELAY = 700

const listeners = new Set()

if (process.browser && process.env.NODE_ENV !== 'production') {
  window.resizeListeners = listeners
}

if (process.browser) {
  window.addEventListener(
    'resize',
    debounce(() => {
      listeners.forEach(listener => listener())
    }, DEBOUNCE_DELAY)
  )
}

export function registerResizeListener(listener) {
  listeners.add(listener)

  return {
    destroy() {
      listeners.delete(listener)
    },
  }
}
