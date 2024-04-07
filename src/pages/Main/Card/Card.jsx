import React, { useEffect, useRef, useState, memo } from 'react'
import styles from './Card.module.scss'
import { useParams } from 'react-router';
// -------------------------
import { Header } from '@/components/Header/Header'
import no_image from './images/noImage.png'
import { Loader } from '@/components/Loader/Loader.jsx'
import { Slider } from '@/components/Slider/Slider'
import { MuiSelect } from '@/components/MuiSelect/MuiSelect';
import { TextField, InputAdornment } from '@mui/material';

export const Card = () => {
  const CardProperties = () => {
    // Я пострался сделать так, чтобы от порядка массива propertiesOrder зависило очередность открытия selects
    let propertiesOrder = ['length', 'width', netsProperties.color ? 'color' : 'thickness']
    let changeFirstProperty = (properties) => { // устанавливает первую сетку из propertiesOrder на false, чтобы она была кликабельна
      for (let property of Object.keys(properties)) {
        property == propertiesOrder[0] ? properties[property] = false : null
      }
      return properties
    }
    let [disabledSelects, setDisabledSelects] = useState(netsProperties.color ? changeFirstProperty({
      length: true,
      width: true,
      color: true,
    }) : changeFirstProperty({
      length: true,
      width: true,
      thickness: true,
    }))
    let selectsRefs = {
      length: useRef(),
      width: useRef(),
      color: useRef(),
      thickness: useRef(),
    }
    let [availableProperties, setAvailableProperties] = useState()
    let [availableNets, setAvailableNets] = useState()

    let getSelectedProperties = () => {
      let selectedProperties = {}
      for (let property of propertiesOrder) {
        selectedProperties[property] = selectsRefs[property].current.querySelector('input').value
      }
      return selectedProperties
    }

    let checkAvailableProperties = (selectProperty) => { // устанавливам доступные свойства по доступным сеткам
      // получаем доступные сетки, по выбранным свойствам
      let selectedProperties = getSelectedProperties()
      let availableNets = []
      for (let property of Object.keys(selectedProperties)) {
        if (selectedProperties[property]) {
          let netsByProperty = nets.filter(net => net[property] == selectedProperties[property])
          if (availableNets.length == 0) {
            availableNets = netsByProperty
          } else {
            availableNets = availableNets.filter(net => netsByProperty.includes(net))
          }
        }
      }
      setAvailableNets(availableNets)

      // преобразуем объект из сеток в объект из доступных свойств
      let newAvailableProperties = {}
      for (let net of availableNets) {
        for (let property of propertiesOrder.slice(propertiesOrder.indexOf(selectProperty)+1)) {
          newAvailableProperties[property] = newAvailableProperties[property] ? 
          new Set([...newAvailableProperties[property], net[property]]) : new Set([net[property]])
          newAvailableProperties[property] = [...newAvailableProperties[property]]
        }
      }

      // сравниваем с прошлыми доступными свойствами (availableProperties) и меняем по необходимости newAvailableProperties
      if (availableProperties) {
        for (let property of propertiesOrder) {
          if (availableProperties[property] && !newAvailableProperties[property]) {
            newAvailableProperties[property] = availableProperties[property]
          }
        }
      }

      setAvailableProperties(newAvailableProperties)
    }

    let [priceValue, setPriceValue] = useState(0)
    let [maxQuantityValue, setMaxQuantityValue] = useState(0)
    let [quantityValue, setQuantityValue] = useState(0)
    let [errorMessage, setErrorMessage] = useState('')

    let onChangeSelect = (selectProperty) => {
      // обнуляем количство и стоимость (quantity, price) и устанавливаем пустые value для нужных select
      setQuantityValue(0)
      setMaxQuantityValue(0)
      setPriceValue(0)
      for (let property of [...propertiesOrder].slice(propertiesOrder.indexOf(selectProperty)+1)) {
        selectsSetOptions[property]('')
      }

      // устанавливаем нужные disabledSelects (поля, которые должны быть некликабельны)
      let newDisabledSelects = {...disabledSelects}
      propertiesOrder[propertiesOrder.indexOf(selectProperty) + 1] ? newDisabledSelects[propertiesOrder[propertiesOrder.indexOf(selectProperty) + 1]] = false : null
      for (let property of propertiesOrder.slice(propertiesOrder.indexOf(selectProperty)+2)) {
        newDisabledSelects[property] = true
      }
      setDisabledSelects(newDisabledSelects)
    }

    let getSelectSetOption = (setOption, property) => {
      selectsSetOptions = {...selectsSetOptions}
      selectsSetOptions[property] = setOption
    }

    useEffect(() => {
      console.log('CardProperties render')
    }, [])

    useEffect(() => {
      let selectedProperties = getSelectedProperties()
      let getSelectProperty = () => {
        for (let property of propertiesOrder) {
          if (!selectedProperties[property]) {
            return propertiesOrder[propertiesOrder.indexOf(property) - 1]
          }
        }
        return propertiesOrder[propertiesOrder.length-1]
      }

      // пересчитываем доступные свойства только если ...
      if (selectedProperties[propertiesOrder[0]]) {
        let selectProperty = getSelectProperty()
        if (selectProperty != propertiesOrder[propertiesOrder.length - 1]) {
          checkAvailableProperties(selectProperty)
        }
      }

      // проверяем нужно ли вставлять картинку или нет
      if (selectedProperties[propertiesOrder[propertiesOrder.length-1]]) {
        setImagesFunction(availableNets[0].images.length != 0 ? availableNets[0].images : [no_image])
        setPriceValue(availableNets[0].price)
        setMaxQuantityValue(availableNets[0].quantity)
        setQuantityValue(availableNets[0].quantity != 0 ? 1 : 0)
      } else {
        setImagesFunction(null)
      }
    }, [disabledSelects])

    let propertyLabels = {
      'width': 'Ширина',
      'length': 'Длина',
      'color': 'Цвет',
      'thickness': 'Толщина',
    }

    return (
      <div className={styles.Card__properties}>
        {propertiesOrder.map(property => 
          <div className={styles.Card__property} key={property}>
            <strong>{propertyLabels[property]}</strong>
            <div className={styles.underline}></div>
            <MuiSelect ref={selectsRefs[property]} disabled={disabledSelects[property]} getSelectSetOption={getSelectSetOption} availableProperties={availableProperties ? availableProperties[property] : false} property={property} onChangeSelect={onChangeSelect} netsProperties={netsProperties}/>
          </div>
        )}
        <div className={`${styles.Card__property} ${styles.Card__additionalProperty}`}>
          <strong>Количество</strong>
          <div className={styles.underline}></div>
          <TextField disabled={!maxQuantityValue} className={styles.Card__property_input} variant="standard" value={quantityValue} onChange={event => {
            if (event.target.value <= maxQuantityValue) {
              setQuantityValue(event.target.value)
              setErrorMessage('')
            } else {
              setErrorMessage(`У нас только ${maxQuantityValue}шт`)
            }
          }} type='number' dir="rtl" error={Boolean(errorMessage)} helperText={errorMessage} InputProps={{
            startAdornment: <InputAdornment sx={{paddingLeft: '5%'}} position="start">шт</InputAdornment>,
            inputProps: {min: 0, max: maxQuantityValue}
          }}/>
        </div>
        <div className={`${styles.Card__property} ${styles.Card__additionalProperty}`}>
          <strong>Стоимость</strong>
          <div className={styles.underline}></div>
          <p>{priceValue*quantityValue}₽</p>
        </div>
      </div>
    )
  }

  // ------------------------------------------------------

  let apiUrl = import.meta.env.VITE_APIURL
  let {netType, cellId, cell} = useParams()
  let [nets, setNets] = useState()
  let [netsProperties, setNetsProperties] = useState()
  let selectsSetOptions = new Set()

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
    setNetsProperties(getNetsProperties(JSON.parse(JSON.stringify(nets)), config))
  }

  useEffect(() => {
    console.log('Card render')
    getData()
  }, [])

  let setImagesFunction = false

  let CardSlider = () => {
    let [images, setImages] = useState(null)
  
    useEffect(() => {
      setImagesFunction = setImages
    }, [])
  
    return (
      <Slider className={styles.Card__slider} images={images}/>
    )
  }

  return (
    <>
      <Header/>
      {!(nets && netsProperties) ? <Loader/> :
        <section className={styles.Card}>
          <CardSlider/>
          <div className={styles.Card__description}>
            <h1>Сетка садовая {netType == 'plastic' ? 'пластиковая' : 'безузелковая'} {cell} мм</h1>
            <CardProperties/>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias alias veniam labore, sapiente totam ipsum? Eum vero laborum adipisci unde, doloribus natus enim, voluptatibus alias facilis modi fuga laudantium nostrum, doloremque ipsa officiis similique fugiat. Doloremque sequi sit animi eaque asperiores? Hic iure sunt inventore harum error quod quasi dolore?</p>
          </div>
        </section>}
    </>
  )
}
