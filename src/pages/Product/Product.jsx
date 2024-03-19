import React from 'react'
import styles from './Product.module.scss'
import { useParams, useLocation } from 'react-router';
import { Header } from '@/components/Header/Header';
import { useNavigate } from 'react-router'

export const Item = (props) => {
  return(
    <div className={styles.Products__item} {...props}>
      <p>12 x 12</p>
      <p>квадрат</p>
      <p>сетка для тотема</p>
    </div>
  )
}

export const Product = () => {
  let {type} = useParams()
  let navigateTo = useNavigate()  

  return (
    <>
      <Header/>
      <section className={styles.Products}>
        <div className={styles.Products__item_header}>
          <p>размер ячейки (мм)</p>
          <p>форма ячейки</p>
          <p>описание</p>
        </div>
        {[1, 2, 3, 4, 5].map(number => {
          return <Item key={number} onClick={() => {navigateTo('/cards/happy')}}/>
        })}
      </section>
    </>
  )
}
