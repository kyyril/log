/**
 * Svelte action: fade + slide-up reveal when element enters the viewport.
 * Usage: <div use:reveal> or <div use:reveal={{ delay: 100 }}>
 */
export function reveal(node: HTMLElement, options: { delay?: number; threshold?: number } = {}) {
  const { delay = 0, threshold = 0.12 } = options

  node.style.opacity = '0'
  node.style.transform = 'translateY(18px)'
  node.style.transition = `opacity 0.45s ease ${delay}ms, transform 0.45s ease ${delay}ms`

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          node.style.opacity = '1'
          node.style.transform = 'translateY(0)'
          observer.unobserve(node)
        }
      })
    },
    { threshold }
  )

  observer.observe(node)

  return {
    destroy() {
      observer.disconnect()
    }
  }
}
