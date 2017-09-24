export const toTitleCase = (string) => {
  const capitalize = (word) => 
    word.slice(0, 1).toUpperCase() + 
    word.slice(1).toLowerCase()

  return string
    .split(' ')
    .map(capitalize)
    .join(' ')
}

export const removeDuplicates = (array) => {
  const table = array.reduce((tbl, el) => {
    if (!tbl[el.toString()]) {
      tbl[el] = el
    }
    return tbl
  }, {})
  
  return Object.keys(table).map((k) => table[k])
}
