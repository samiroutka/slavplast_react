import React from 'react'
import {Alert} from '@mui/material'
import styles from './MyAlert.module.scss'

export let showAlert = (alert) => {
  if (!alert.classList.contains(styles.MyAlert_visible)){
    alert.classList.add(styles.MyAlert_visible)
    setTimeout(() => {
      alert.classList.remove(styles.MyAlert_visible)
    }, 2000)
  }
}

export const MyAlert = React.forwardRef((props, ref) => {
  return (
    <Alert ref={ref} {...props} className={styles.MyAlert}>{props.children}</Alert>
  )
})
