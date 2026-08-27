export function sortAlphabetical(arr) {
  if (!Array.isArray(arr)) return []
  const candidates = ['nombre', 'name', 'label']
  // detect if items are primitives (strings)
  if (arr.length && typeof arr[0] === 'string') {
    return arr.slice().sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }))
  }
  // detect key to sort by
  const key = candidates.find(k => arr.some(item => item && Object.prototype.hasOwnProperty.call(item, k)))
  if (key) {
    return arr.slice().sort((a, b) => {
      const va = a && a[key] != null ? String(a[key]) : ''
      const vb = b && b[key] != null ? String(b[key]) : ''
      return va.localeCompare(vb, undefined, { sensitivity: 'base', numeric: true })
    })
  }
  // fallback: stringify and compare
  return arr.slice().sort((a, b) => {
    const sa = a && typeof a === 'object' ? JSON.stringify(a) : String(a)
    const sb = b && typeof b === 'object' ? JSON.stringify(b) : String(b)
    return sa.localeCompare(sb, undefined, { sensitivity: 'base' })
  })
}
