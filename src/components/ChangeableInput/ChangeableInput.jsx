import React, { useState } from 'react'
import styles from './ChangeableInput.module.scss'
import { IconButton, TextField } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';

export const ChangeableInput = ({className, isEdit, type, defaultValue, onEdit = () => {}, onConfirm = () => {}, ...otherProps}) => {
  let [value, setValue] = useState(defaultValue)
  return (
    <div {...otherProps} className={`${styles.ChangeableInput} ${className ? className : ''}`} onClick={event => event.stopPropagation()}>
      {isEdit ?
        <TextField value={value} onChange={event => setValue(event.target.value)} type={type}/>
      : <p>{value}</p>}
      {isEdit ? <IconButton onClick={() => {onConfirm(value)}}><CheckIcon/></IconButton>
      : <IconButton onClick={onEdit}><EditIcon/></IconButton>}
    </div>
  )
}
