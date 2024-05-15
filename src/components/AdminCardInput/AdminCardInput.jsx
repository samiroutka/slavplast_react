import React, { useEffect, useState } from 'react'
import { TextField } from '@mui/material'

export const AdminCardInput = React.forwardRef(({className, label, defaultValue, id}, ref) => {
  let [value, setValue] = useState(String(defaultValue) ? defaultValue : '')

  return (
    <TextField ref={ref} className={className ? className : ''} value={value} onChange={event => setValue(event.target.value)} label={label} id={id} variant="filled" type='number'/>
  )
})
