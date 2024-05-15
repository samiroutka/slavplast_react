import React, { useState } from 'react'
import styles from './AdminRangeInput.module.scss'
import { TextField } from '@mui/material'

export const AdminRangeInput = ({label1, label2, value1, value1Set, value2, value2Set}) => {
  return (
    <div className={styles.AdminRangeInput}>
      <TextField variant='filled' label={label1} value={value1} onChange={event => value1Set(event.target.value)}/>
      <TextField variant='filled' label={label2} value={value2} onChange={event => value2Set(event.target.value)}/>
    </div>
  )
}
