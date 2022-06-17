import { useMemo } from "react"

export const useFilter = (tabledata, column, condition, query) => {
  const filteredData = useMemo(() => {
    console.log('useFilter');
    if (column && (condition === 'equals') && query) {
      return tabledata.filter(tablerow => tablerow[column].toString().toLowerCase() === query.toLowerCase())
    }
    if (column && (condition === 'includes') && query) {
      return tabledata.filter(tablerow => tablerow[column].toString().toLowerCase().includes(query.toLowerCase()))
    }
    if (column && (condition === 'larger') && query) {
      if (typeof(tabledata[0]) === 'number') {
        return tabledata.filter(tablerow => tablerow[column] > Number(query))
      }
      return tabledata.filter(tablerow => tablerow[column] > query)
    }
    if (column && (condition === 'smaller') && query) {
      if (typeof(tabledata[0]) === 'number') {
        return tabledata.filter(tablerow => tablerow[column] < Number(query))
      }
      return tabledata.filter(tablerow => tablerow[column] < query)
    }
    return tabledata
  }, [query, tabledata, column, condition])
  return filteredData
}
