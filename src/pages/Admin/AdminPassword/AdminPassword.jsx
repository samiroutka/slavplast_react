import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import styles from './AdminPassword.module.scss'
import { TextField, Button } from '@mui/material';
import { Loader } from '@/components/Loader/Loader.jsx'

export const AdminPassword = () => {
  let apiUrl = import.meta.env.VITE_APIURL
  let navigateTo = useNavigate()

  let [value, setValue] = useState('')
  let [inputError, setInputError] = useState()
  let [password, setPassword] = useState()

  let getPassword = async () => {
    let response = await fetch(`${apiUrl}/password`)
    setPassword(await response.json())
  }

  useEffect(() => {
    getPassword()
  }, [])

  return (
    <>
      {!password ? <Loader/> : null}
      <div className={styles.AdminPassword}>
        <TextField value={value} error={Boolean(inputError)} helperText={inputError} onChange={() => setValue(event.target.value)} className={styles.AdminPassword__input} label='пароль' variant='standard'/>
        <Button variant='contained' onClick={async () => {
          value == password ? navigateTo('/admin/plastic') : setInputError('Пароль неверный')
        }}>Войти</Button>
      </div>
    </>
  )
}
