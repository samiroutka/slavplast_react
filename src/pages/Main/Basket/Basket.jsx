import React, { useContext, useEffect, useState } from 'react'
import styles from './Basket.module.scss'
import { Header } from '@/components/Header/Header'
import { context } from '@/context.js'
import { ChangeableInput } from '@/components/ChangeableInput/ChangeableInput';
import { Button, IconButton } from '@mui/material';
import HeightIcon from '@mui/icons-material/Height';
import PaletteIcon from '@mui/icons-material/Palette';
import AppsIcon from '@mui/icons-material/Apps';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import LineWeightIcon from '@mui/icons-material/LineWeight';
import { useNavigate } from 'react-router'

let EditableProperty = ({net, setMaxQuantityMsg}) => {
  let {basket, setBasket} = useContext(context)
  let setBasketCallback = (newValue) => {
    if (newValue < 1 || newValue > net.maxQuantity) {
      setMaxQuantityMsg(newValue < 1 ? null : `У нас только ${net.maxQuantity} шт`)
      return basket
    } else {
      let indexOfcurrentNet = basket.indexOf(net)
      net.price = net.price/net.quantity*newValue
      net.quantity = newValue
      let newBasket = JSON.parse(JSON.stringify(basket))
      newBasket[indexOfcurrentNet] = net
      setMaxQuantityMsg('')
      return newBasket
    }
  }
  return (
    <div style={{display: 'flex', alignItems: 'center'}}>
      <IconButton sx={{height: '100%'}} onClick={event => {
        event.stopPropagation()
        let newValue = net.quantity - 1
        setBasket(() => setBasketCallback(newValue))
      }}><RemoveIcon/></IconButton>
      <p>{net.quantity}</p>
      <IconButton sx={{height: '100%'}} onClick={event => {
        event.stopPropagation()
        let newValue = net.quantity + 1
        setBasket(() => setBasketCallback(newValue))
      }}><AddIcon/></IconButton>
    </div>
  )
}

let Basket_net = ({net}) => {
  let [maxQuantityMsg, setMaxQuantityMsg] = useState()

  return (
    <div onClick={() => navigateTo(`/nets/${net.netType == 'пластиковая' ? 'plastic' : 'knotless'}/${net.id}`)} key={net.price+Math.random()*100000} className={styles.Basket__net}>
      <div className={styles.Basket__netProperty}>
        <IconButton onClickCapture={() => setBasket(basket.filter(element => basket.indexOf(element) != basket.indexOf(net)))} variant='outlined' color='error'><DeleteIcon/></IconButton>
        <img src={net.images[0]} className={styles.Basket__image}/>
      </div>
      <p className={styles.Basket__netProperty}>
        {net.netType}
      </p>
      <p className={styles.Basket__netProperty}>
        <AppsIcon/>
        {net.cell}мм
      </p>
      <p className={styles.Basket__netProperty}>
        <HeightIcon sx={{transform: 'rotate(90deg)'}}/>
        {net.length}м
      </p>
      <p className={styles.Basket__netProperty}>
        <HeightIcon/>
        {net.width}м
      </p>
      {net.color ? 
        <p className={styles.Basket__netProperty}>
          <PaletteIcon/>
          {net.color}
        </p>
      : 
        <p className={styles.Basket__netProperty}>
          <LineWeightIcon/>
          {net.thickness}мм
        </p>}
      <div className={styles.Basket__netProperty}>
        <EditableProperty value={net.quantity} net={net} setMaxQuantityMsg={setMaxQuantityMsg}/>
        <span style={{color: 'red'}}>{maxQuantityMsg}</span>
        <span>{net.price}₽</span>
      </div>
    </div>
  )
}

export const Basket = () => {
  let navigateTo = useNavigate()
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
              {basket.map(net => <Basket_net net={net}/>)}
            </div>
            <div className={styles.Basket__results}>
              <span>Количество товаров: {basket.reduce((sum, item) => sum += item.quantity, 0)}</span>
              <span>Итого: <h3 style={{display: 'inline'}}>{totalPrice}₽</h3></span>
              <Button variant='contained'>Оформить</Button>
            </div>
          </div> :
        <p>вы ничего не добавили (</p>}
      </section>
    </>
  )
}
