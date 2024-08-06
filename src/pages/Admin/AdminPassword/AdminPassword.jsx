import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import styles from './AdminPassword.module.scss'
import { TextField, Button } from '@mui/material';
import { Loader } from '@/components/Loader/Loader.jsx'
import { context } from '@/context.js'

export const AdminPassword = () => {
  let apiUrl = import.meta.env.VITE_APIURL
  let {setAdminpassword} = useContext(context)
  let navigateTo = useNavigate()

  let [value, setValue] = useState('')
  let [inputError, setInputError] = useState()
  let [password, setPassword] = useState()

  let getPassword = async () => {
    let response = await fetch(`${apiUrl}/password`)
    setPassword(await response.json())
  }

  function getCookie() {
    return document.cookie.split('; ').reduce((acc, item) => {
      const [name, value] = item.split('=')
      acc[name] = value
      return acc
    }, {})
  }

  useEffect(() => {
    getPassword()
    console.log(getCookie()['adminpassword'])
  }, [])

  return (
    <>
      {!password ? <Loader/> : null}
      <div className={styles.AdminPassword}>
        <TextField value={value} error={Boolean(inputError)} helperText={inputError} onChange={() => setValue(event.target.value)} className={styles.AdminPassword__input} label='пароль' variant='standard'/>
        <Button variant='contained' onClick={async () => {
          if (value == password) {
            document.cookie=`adminpassword=true;max-age=30`
            setAdminpassword(true)
            navigateTo('/admin/plastic')
          } else {
            setInputError('Пароль неверный')
          }
        }}>Войти</Button>
      </div>
    </>
  )
}
