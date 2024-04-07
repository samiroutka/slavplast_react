import React, { useEffect, useState, useRef} from 'react'
import { useNavigate } from 'react-router'
import styles from './Header.module.scss'
import logo from './images/logo.png'
import whatsapp from './images/whatsapp_icon.gif'
import geo from './images/geo_icon.gif'
import basket from './images/basket.svg'

export const Header = ({className}) => {
  let navigateTo = useNavigate()  

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
      <img className={styles.Header__basket} src={basket} alt="" />
    </section>
  )
}
