import React, { useContext, useEffect, useState } from 'react'
import styles from './Basket.module.scss'
import { Header } from '@/components/Header/Header'
import { context } from '@/context.js'
import { ChangeableInput } from '@/components/ChangeableInput/ChangeableInput';
import { Button } from '@mui/material';

let EditableProperty = ({defaultValue, ...otherProps}) => {
  let {basket, setBasket} = useContext(context)
  let [isEdit, setIsEdit] = useState(false)

  return (
    <ChangeableInput {...otherProps} type="number" isEdit={isEdit} onEdit={() => setIsEdit(true)} onConfirm={value => {
      setIsEdit(false)
      setBasket(basket.map(net => {
        if (net.quantity == defaultValue) {
          return {...net, quantity: parseInt(value), price: (net.price/net.quantity)*parseInt(value)}
        } else {
          return net
        }
      }))
    }} defaultValue={defaultValue}/>
  )
}

export const Basket = () => {
  let {basket, setBasket} = useContext(context)
  let [totalPrice, setTotalPrice] = useState(0)

  useEffect(() => {
    let netTotalPrice = 0
    for (let net of basket) {
      netTotalPrice += net.price
    }
    setTotalPrice(netTotalPrice)
  }, [basket])

  return (
    <>
      <Header/>
      <section className={styles.Basket}>
        <h2>Сетки</h2>
        {basket.length != 0 ?
          <div className={styles.Basket__netsWrapper}>
            <div className={styles.Basket__nets}>
              {basket.map(net => 
                <div className={styles.Basket__net}>
                  <img src={net.images[0]} className={styles.Basket__image}/>
                  <p>
                    ячейка
                    <span>{net.cell}мм</span>
                  </p>
                  <p>
                    длина
                    <span>{net.length}м</span>
                  </p>
                  <p>
                    ширина
                    <span>{net.width}м</span>
                  </p>
                  <p>
                    цвет
                    <span>{net.color}</span>
                  </p>
                  <div>
                    кол-во
                    <EditableProperty className={styles.Basket__editableProperty} defaultValue={net.quantity}/>
                  </div>
                  <p>
                    цена
                    <span>{net.price}₽</span>
                  </p>
                  <Button onClick={() => setBasket(basket.filter(element => element != net))} variant='outlined' color='error'>удалить</Button>
                </div>)}
            </div>
            <div className={styles.Basket__results}>
              Итого: {totalPrice}₽ 
              <Button variant='contained'>Оформить</Button>
            </div>
          </div> :
        <p>вы ничего не добавили (</p>}
      </section>
    </>
  )
}
