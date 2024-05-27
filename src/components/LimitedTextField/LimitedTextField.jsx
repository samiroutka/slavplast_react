import React, { useState } from 'react'
import { TextField, InputAdornment } from '@mui/material';

export const LimitedTextField = ({className = '', maxValue, value, setValue}) => {
  let [errorMessage, setErrorMessage] = useState('')
  
  return (
    <TextField disabled={!maxValue} className={className} variant="standard" value={value} onChange={event => {
      if (event.target.value <= maxValue && event.target.value >= 0) {
        setValue(event.target.value)
        setErrorMessage('')
      } else {
        setErrorMessage(`У нас только ${maxValue}шт`)
      }
    }} type='number' dir="rtl" error={Boolean(errorMessage)} helperText={errorMessage} InputProps={{
      startAdornment: <InputAdornment sx={{paddingLeft: '5%'}} position="start">шт</InputAdornment>,
      inputProps: {min: 0, max: maxValue}
    }}/>
  )
}
