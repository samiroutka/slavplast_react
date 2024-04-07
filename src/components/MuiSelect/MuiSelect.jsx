import React, { useState, useEffect } from 'react'
import { MenuItem, Select, FormControl } from '@mui/material';

export const MuiSelect = React.forwardRef(({property, disabled, onChangeSelect, availableProperties, getSelectSetOption, netsProperties}, ref) => {
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
        {Object.entries(netsProperties[property]).map(([key, value]) => 
          <MenuItem key={key} value={key} disabled={availableProperties ? !availableProperties.includes(parseInt(key)) ? true : false : false}>{value}</MenuItem>
        )}
      </Select>
    </FormControl>
  )
})