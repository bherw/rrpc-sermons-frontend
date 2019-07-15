export function getScrollContainer() {
  return document.scrollingElement
}

export function registerEventListener(node, event, cb, opts) {
  node.addEventListener(event, cb, opts)

  return {
    destroy() {
      node.removeEventListener(event, cb)
    },
  }
}
