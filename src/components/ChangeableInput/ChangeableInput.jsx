import React, { useState } from 'react'
import styles from './ChangeableInput.module.scss'
import { IconButton, TextField } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';

export const ChangeableInput = ({className, textFieldProps, maxValue, isEdit, type, defaultValue, onEdit = () => {}, onConfirm = () => {}, ...otherProps}) => {
  let [value, setValue] = useState(defaultValue)
  let [error, setError] = useState('')

  return (
    <div {...otherProps} className={`${styles.ChangeableInput} ${className ? className : ''}`} onClick={event => event.stopPropagation()}>
      {isEdit ?
        <TextField {...textFieldProps} value={value} onChange={event => {
          if (maxValue) {
            if (event.target.value <= maxValue && event.target.value >= 0) {
              setValue(event.target.value)
              setError('')
            } else {
              setError(`У нас только ${maxValue}шт`)
            }
          } else {
            setValue(event.target.value)
          }
        }} type={type} error={Boolean(error)} helperText={error} InputProps={{inputProps: {min: 1, max: maxValue ? maxValue : null}}}/>
      : <p>{value}</p>}
      {isEdit ? <IconButton onClick={() => {onConfirm(value)}}><CheckIcon/></IconButton>
      : <IconButton onClick={onEdit}><EditIcon/></IconButton>}
    </div>
  )
}
