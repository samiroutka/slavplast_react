import React, { useState, useEffect } from 'react'
import { MenuItem, Select, FormControl } from '@mui/material';

export const MuiSelect = React.forwardRef(({property, disabled, onChangeSelect, availableVariantsOfProperty, getSelectSetOption, netsProperties}, ref) => {
  const [option, setOption] = useState('')

  useEffect(() => {
    getSelectSetOption(setOption, property)
  }, [])

  useEffect(() => {
    option ? onChangeSelect(property) : null
  }, [option])

  return (
    <FormControl variant="standard" fullWidth sx={{ width: 'fit-content' }}>
      <Select
        disabled={disabled}
        ref={ref}
        value={option}
        onChange={(event) => {
          setOption(event.target.value)
        }}>
        {Object.values(netsProperties[property]).map((value) => 
          <MenuItem key={value} value={value} disabled={availableVariantsOfProperty ? (availableVariantsOfProperty.includes(value) ? false : true) : false}>{value}</MenuItem>
        )}
      </Select>
    </FormControl>
  )
})