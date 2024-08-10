import React, { useContext, useEffect, useState } from 'react'
import styles from './Net.module.scss'
import { context } from '@/context.js'
import { useParams } from 'react-router'
import { Header } from '@/components/Header/Header';
import { Loader } from '@/components/Loader/Loader';
import { Slider } from '@/components/Slider/Slider.jsx'
import { AddToBasket } from '@/components/AddToBasket/AddToBasket';
import { LimitedTextField } from '@/components/LimitedTextField/LimitedTextField.jsx';
import noImage from './noImage.png'

export const Net = () => {
  let apiUrl = import.meta.env.VITE_APIURL
  let {netType, id} = useParams()
  let [net, setNet] = useState()
  let {basket, setBasket} = useContext(context)

  let getNet = async () => {
    let respone = await fetch(`${apiUrl}/net/${netType}/${id}`)
    setNet(await respone.json())
  }

  let netTypesLabels = {
    'plastic': 'пластиковая',
    'knotless': 'безузелковая',
  }

  useEffect(() => {
    getNet()
  }, [])

  let [quantity, setQuantity] = useState(1)

  return (
    <>
      <Header/>
      {net ?
        <section className={styles.Net}>
          {net.images.length > 0 ?
            <Slider className={styles.Net__slider} images={net.images}/>  
          : <img className={styles.net__noimage} src={noImage}/>}
          <div className={styles.Net__properties}>
            {Object.entries({
              'ячейка': 'cell',
              'длина': 'length',
              'ширина': 'width',
              ...(net.color && {'цвет': 'color'}) // классный способ: оператор && выполняет выражение после него только если выражение до него истинно
            }).map(([key, value]) => 
              <div key={value} className={styles.Net__property}>
                <span>{key}</span>
                <span className={styles.underline}></span>
                <span>{net[value]}</span>
              </div>
            )}
            <div className={styles.Net__property}>
              <span>количество</span>
              <span className={styles.underline}></span>
              <LimitedTextField maxValue={net.quantity} value={quantity} setValue={setQuantity}/>
            </div>
            <div className={styles.Net__property}>
              <span>цена</span>
              <span className={styles.underline}></span>
              <span>{net.price * quantity}</span>
            </div>
            <AddToBasket errorProviso={quantity == 0} onSuccess={() => setBasket([...basket, {
              ...net,
              quantity: quantity,
              maxQuantity: net.quantity,
              price: net.price * quantity,
              images: [net.images[0] ? net.images[0] : noImage],
              netType: netTypesLabels[netType],
            }])}/>
          </div>
        </section>
      : <Loader/>}
    </>
  )
}
