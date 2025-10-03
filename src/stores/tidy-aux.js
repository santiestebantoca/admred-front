import { filter, arrange, desc } from '@tidyjs/tidy'

export const filtersByObject = filterObj => {
  let res = []
  Object.entries(filterObj || {}).forEach(([key, value]) => {
    if (value === undefined) return
    if (value === null)
      res.push(filter((d) => d[key] === null))
    else if (typeof value === 'boolean')
      res.push(filter((d) => value ? d[key] : !d[key]))
    else if (typeof value === 'number')
      res.push(filter((d) => d[key] === value))
    else if (typeof value === 'string') {
      const search = value.toUpperCase()
      res.push(filter((d) => (d[key] || '').toUpperCase().includes(search)))
    }
  })
  return res
}

export const orderByObject = orderObj => {
  if (orderObj.field && orderObj.direction) {
    if (orderObj.direction === 'asc') return [arrange([orderObj.field])]
    else return [arrange([desc(orderObj.field)])]
  } else return []
}

export const searchByObject = searchObj => {
  return searchObj.fields.map(f => filter(d => d[f].includes(searchObj.text)))
}