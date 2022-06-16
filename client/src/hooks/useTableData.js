import { useMemo } from "react"

export const useFilter = (tabledata, column, condition, query) => {
  const filteredData = useMemo(() => {
    if (condition === 'includes' && query) {
      return tabledata.filter(tablerow => tablerow[column].toString().toLowerCase().includes(query.toLowerCase()))
    }
    return tabledata
  }, [query, tabledata, column, condition])
  return filteredData
}
