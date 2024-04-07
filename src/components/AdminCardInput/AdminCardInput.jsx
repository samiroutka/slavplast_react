import React, { useEffect } from 'react'
import styles from './AdminCardInput.module.scss'
import { TextField } from '@mui/material'

export const AdminCardInput = React.forwardRef(({label, defaultValue, id}, ref) => {
  return (
    <TextField ref={ref} className={styles.AdminCardInput} defaultValue={String(defaultValue) ? defaultValue : ''} label={label} id={id} variant="filled" type='number'/>
  )
})
