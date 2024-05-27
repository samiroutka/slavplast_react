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
  let [config, setConfig] = useState()
  let {basket, setBasket} = useContext(context)

  let getNet = async () => {
    let respone = await fetch(`${apiUrl}/net/${netType}/${id}`)
    setNet(await respone.json())
  }

  let getConfig = async () => {
    let response = await fetch(`${apiUrl}/config/${netType}`)
    let responseData = await response.json()
    response.ok ? setConfig(responseData) : setConfig(false)
  }

  let getDataWrapper = async () => {
    await getNet()
    await getConfig()
  }

  let getNetPropertiesByConfig = () => {
    let netProperties = {}
    for (let [key, value] of Object.entries(net)) {
      if (config[key]) {
        netProperties[key] = config[key].find(element => element.id == value)[key]
      }
    }
    setNet({...net, ...netProperties})
  }

  let netTypesLabels = {
    'plastic': 'пластиковая',
    'knotless': 'безузелковая',
  }

  useEffect(() => {
    getDataWrapper()
  }, [])

  useEffect(() => {
    if (net && config && !(typeof net.cell == 'string')) { // делаем проверку на строку, чтобы не было безконечного setNet из-за useEffect с зависимостями [net, config]
      getNetPropertiesByConfig()
    }
  }, [net, config])

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
            <div className={styles.Net__property}>
              <span>ячейка</span>
              <span className={styles.underline}></span>
              <span>{net.cell}</span>
            </div>
            <div className={styles.Net__property}>
              <span>длина</span>
              <span className={styles.underline}></span>
              <span>{net.length}</span>
            </div>
            <div className={styles.Net__property}>
              <span>ширина</span>
              <span className={styles.underline}></span>
              <span>{net.width}</span>
            </div>
            {net.color ? 
              <div className={styles.Net__property}>
                <span>цвет</span>
                <span className={styles.underline}></span>
                <span>{net.color}</span>
              </div>
            : null}
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
