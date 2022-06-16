import React from 'react'
import MySelect from "./UI/select/MySelect"
import MyInput from "./UI/input/MyInput"

export default function TableFilter({filter, setFilter}) {
  return (
    <div>
      <MySelect 
        value={filter.column}
        onChange={selectedColumn => setFilter({ ...filter, column: selectedColumn})}
        defaultValue='Фильтровать по...'
        options={[
          {value: 'name', name: 'по имени'},
          {value: 'amount', name: 'по количеству'},
          {value: 'distance', name: 'по расстоянию'}
        ]}
      />
      <MySelect 
        value={filter.condition}
        onChange={selectedCondition => setFilter({ ...filter, condition: selectedCondition})}
        defaultValue='условие'
        options={[
          {value: 'equal', name: 'равно'},
          {value: 'includes', name: 'содержит'},
          {value: 'larger', name: 'больше'},
          {value: 'smaller', name: 'меньше'}
        ]}
      />
       <MyInput 
        value={filter.query}
        onChange={e => setFilter({ ...filter, query: e.target.value})}
        placeholder="значение для фильтрации"
      />
    </div>
  )
}
