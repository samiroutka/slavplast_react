import React, { useEffect } from 'react'
import {Alert, Button} from '@mui/material'
import styles from './MyAlert.module.scss'

export let closeAlert = (alert) => {
  alert.classList.remove(styles.MyAlert_visible)
}

export let showAlert = (alert, duration=2000) => {
  if (!alert.classList.contains(styles.MyAlert_visible)){
    alert.classList.add(styles.MyAlert_visible)
    setTimeout(() => {
      alert.classList.remove(styles.MyAlert_visible)
    }, duration)
  }
}

export const MyAlert = React.forwardRef((props, ref) => {
  let {actionText, actionCallback} = props
  let propsForAlert = {...props}
  delete propsForAlert['actionText']
  delete propsForAlert['actionCallback']
  return (
    <Alert ref={ref} {...propsForAlert} className={styles.MyAlert}
      action={ actionText ? 
        <Button onClick={actionCallback} color="inherit" size="small">
          {actionText}
        </Button> : null
      }
    >{props.children}</Alert>
  )
})
