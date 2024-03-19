import React from 'react'
import styles from './Loader.module.scss'
import {CircularProgress} from '@mui/material'

export const Loader = () => {
  return (
    <div className={styles.Loader__wrapper}>
      <CircularProgress className={styles.Loader}/>
    </div>
  )
}
