import React, { useEffect, useRef, useState, useContext } from 'react'
import styles from './Card.module.scss'
import { useParams } from 'react-router';
import { Header } from '@/components/Header/Header'
import { Loader } from '@/components/Loader/Loader.jsx'
import { Slider } from '@/components/Slider/Slider'
import { CardProperties } from '@/components/CardProperties/CardProperties.jsx'
import { Button } from '@mui/material'
import { context } from '@/context.js'

export const Card = () => {
  let apiUrl = import.meta.env.VITE_APIURL
  let {netType, cellId, cell} = useParams()
  let {basket, setBasket} = useContext(context)
  let [config, setConfig] = useState()
  let [nets, setNets] = useState()
  let [netsProperties, setNetsProperties] = useState()
  let [cellDescription, setCellDescription] = useState()
  let [selectNetValues, setSelectNetValues] = useState()

  let getNetsProperties = (nets, config) => {
    let newNetsProperties = {}
    for (let net of nets) {
      for (let unnecessaryProperty of ['id', 'images', 'price', 'quantity']) {
        delete net[unnecessaryProperty]
      }
      for (let property of Object.keys(net)) {
        if (newNetsProperties[property]) {
          newNetsProperties[property][net[property]] = config[property].filter(variant => variant.id == net[property])[0][property]
        } else {
          newNetsProperties[property] = {}
          newNetsProperties[property][net[property]] = config[property].filter(variant => variant.id == net[property])[0][property]
        }
      }
    }
    return newNetsProperties
  }

  let getData = async () => {
    let nets = await fetch(`${apiUrl}/cells/${netType}/${cellId}`)
    nets = await nets.json()
    setNets(nets)

    let config = await fetch(`${apiUrl}/config/${netType}`)
    config = await config.json()
    setConfig(config)
    setCellDescription(config.cell.filter(item => item.cell == cell)[0].description)
    setNetsProperties(getNetsProperties(JSON.parse(JSON.stringify(nets)), config))
  }

  let getDataUsingConfig = ({quantity, price, images, ...net}) => {
    let finalNet = {price, quantity}
    for (let [key, value] of Object.entries(net)) {
      finalNet[key] = config[key].find(element => element.id == value)[key]
    }
    return finalNet
  }

  useEffect(() => {
    getData()
  }, [])

  let [images, setImages] = useState(null)

  let basketButtonError = () => {
    setBasketButtonColor('error')
    setBasketButtonValue('выберите свойства')
    setTimeout(() => {
      setBasketButtonColor('primary')
      setBasketButtonValue('добавить в корзину')
    }, 2000)
  }

  let basketSuccesButton = () => {
    setBasketButtonColor('success')
    setBasketButtonValue('в корзине')
    setTimeout(() => {
      setBasketButtonColor('primary')
      setBasketButtonValue('добавить в корзину')
    }, 2000)
  }

  let [basketButtonValue, setBasketButtonValue] = useState('добавить в корзину') 
  let [basketButtonColor, setBasketButtonColor] = useState('primary')
  let elementToBasketRef = useRef()
  let [toBasket, setToBasket] = useState(false)
  let animationDuration = 1000
  let getBasketAnimationСoordinates = () => {
    let basket = document.querySelector('#basket')
    let x = basket.offsetLeft - elementToBasketRef.current.offsetLeft
    let y = basket.offsetTop - elementToBasketRef.current.offsetTop
    return [x, y]
  }

  return (
    <>
      <Header/>
      {!(nets && netsProperties) ? <Loader/> :
        <section className={styles.Card}>
          <Slider className={styles.Card__slider} images={images}/>
          <div className={styles.Card__info}>
            <h1>Сетка {netType == 'plastic' ? 'пластиковая' : 'безузелковая'} {cell} мм</h1>
            <CardProperties setSelectNetValues={setSelectNetValues} nets={nets} netsProperties={netsProperties} setImages={setImages}/>
            <div style={{width: 'fit-content'}} >
              <Button color={basketButtonColor} onClick={() => {
                if (selectNetValues.price == 0) {
                  basketButtonError()
                } else {
                  setBasket([...basket, {...getDataUsingConfig(selectNetValues),  images: images}])
                  // ----------animation---------------
                  setToBasket(true)
                  setTimeout(() => {
                    setToBasket(false)
                    basketSuccesButton() // меняем цвет и текст кнопки
                  }, animationDuration)
                }
              }} className={styles.Card__basketButton} variant='outlined'>{basketButtonValue}</Button>
              <div ref={elementToBasketRef} style={toBasket ? {
                opacity: 0.5,
                transition: `all ${animationDuration}ms ease-in-out`,
                transform: `translate(${getBasketAnimationСoordinates()[0]}px, ${getBasketAnimationСoordinates()[1]}px)`
              } : null} className={styles.Card__elementToBasket}></div>
            </div>
            <div className={styles.Card__description} dangerouslySetInnerHTML={{ __html: cellDescription ? cellDescription : 'Это великолепная ячейка' }}></div>
          </div>
        </section>}
    </>
  )
}
