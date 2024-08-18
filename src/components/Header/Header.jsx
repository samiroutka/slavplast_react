import React, { useEffect, useState, useRef, useContext} from 'react'
import { useNavigate } from 'react-router'
import { context } from '@/context.js'
import styles from './Header.module.scss'
import logo from './images/logo.png'
import whatsapp from './images/whatsapp_icon.gif'
import geo from './images/geo_icon.gif'
import basket from './images/basket.svg'
import { Badge } from '@mui/material'
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';

export const Header = ({className}) => {
  let navigateTo = useNavigate()  
  let {basket} = useContext(context)

  let [adminEventTest, setAdminEventTest] = useState(false)
  let adminEventTestRef = useRef()

  useEffect(() => {
    if (adminEventTest && location.pathname == '/') {
      setTimeout(() => {
        adminEventTestRef.current ? navigateTo('/admin/password') : null
      }, 1000)
    }
  }, [adminEventTest])

  useEffect(() => {
    adminEventTestRef.current = adminEventTest
  }, [adminEventTest])


  return (
    <section className={`${styles.Header} ${className}`}>
      <img className={styles.Header__logo} src={logo} onClick={() => {navigateTo('/')}} alt=""
      onMouseDown={() => setAdminEventTest(true)} onTouchStart={() => setAdminEventTest(true)}
      onMouseUp={() => setAdminEventTest(false)} onTouchEnd={() => setAdminEventTest(false)} />
      <div className={styles.Header__description}>
        <div className={`${styles.Header__contacts} ${styles.Header__descriptionElement}`}>
          <img src={whatsapp} alt="" />
          <div className={styles.Header__subDescription}>
            <p className={styles.Header__subTitle}>ТЕЛЕФОН:</p>
            <span>+7 (87935) 3-22-10<br/>Whatsapp: +79283681251<br/>slavplastkmv@mail.ru</span>
          </div>
        </div>
        <div className={`${styles.Header__address} ${styles.Header__descriptionElement}`}>
          <img src={geo} alt="" />
          <div className={styles.Header__subDescription}>
            <p className={styles.Header__subTitle}>АДРЕС:</p>
            <span>г. Лермонтов, ул. Промышленная 15/22</span>
          </div>
        </div>
      </div>
      <Badge badgeContent={basket.reduce((sum, item) => sum += item.quantity, 0)} color='success'>
        {/* <img id='basket' onClick={() => navigateTo('/basket')} className={styles.Header__basket} src={basket} alt="" /> */}
        <ShoppingBasketIcon color='action' fontSize="large" id='basket' onClick={() => navigateTo('/basket')} className={styles.Header__basket}/>
      </Badge>
      {/* id нужен чтобы можно было найти элемент для анимации */}
    </section>
  )
}
