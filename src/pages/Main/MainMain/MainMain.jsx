import React, { useEffect, useRef } from 'react'
import { Header } from '@/components/Header/Header'
import styles from './MainMain.module.scss'
import net1 from './images/net1.jpg'
import net2 from './images/net2.jpg'
import { useNavigate } from 'react-router'

export const MainMain = () => {
  let navigateTo = useNavigate()

  return (
    <div className={styles.Main}>
      <Header className={styles.Main__header}/>
      <section className={styles.Main__products}>
        <div className={styles.Main__product} onClick={() => {navigateTo(`/sorting/plastic`)}}>
          <img src={net1} alt="" />
          <p>Пластиковая сетка</p>
        </div>
        <div className={styles.Main__product} onClick={() => {navigateTo(`/sorting/knotless`)}}>
          <img src={net2} alt="" />
          <p>Безузелковая сетка</p>
        </div>
      </section> 
    </div>
  )
}
