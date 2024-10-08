import React, { useEffect, useRef, useState, memo } from 'react'
import styles from './CardProperties.module.scss'
import { MuiSelect } from '@/components/MuiSelect/MuiSelect';
import no_image from './noImage.png'
import { LimitedTextField } from '@/components/LimitedTextField/LimitedTextField.jsx'

let selectsSetOptions = {}

export const CardProperties = ({setSelectNetValues, nets, netsProperties, setImages}) => {
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
  let [priceValue, setPriceValue] = useState(0)
  let [maxQuantityValue, setMaxQuantityValue] = useState(0)
  let [quantityValue, setQuantityValue] = useState(0)

  let getSelectedProperties = () => {
    let selectedProperties = {}
    for (let property of propertiesOrder) {
      selectedProperties[property] = selectsRefs[property].current.querySelector('input').value
    }
    return selectedProperties
  }

  let checkAndSetAvailableProperties = (selectProperty) => { // устанавливам доступные свойства по доступным сеткам
    // получаем доступные сетки, по выбранным свойствам
    let selectedProperties = getSelectedProperties()
    let innerAvailableNets = []
    for (let property of Object.keys(selectedProperties)) {
      if (selectedProperties[property]) {
        let netsByProperty = nets.filter(net => net[property] == selectedProperties[property])
        if (innerAvailableNets.length == 0) {
          innerAvailableNets = netsByProperty
        } else {
          innerAvailableNets = innerAvailableNets.filter(net => netsByProperty.includes(net))
        }
      }
    }
    setAvailableNets(innerAvailableNets)

    // преобразуем объект из сеток в объект из доступных свойств
    let newAvailableProperties = {}
    for (let net of innerAvailableNets) {
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
        checkAndSetAvailableProperties(selectProperty)
      }
    }

    // проверяем нужно ли вставлять картинку или нет
    if (selectedProperties[propertiesOrder[propertiesOrder.length-1]]) {
      setImages(availableNets[0].images.length != 0 ? availableNets[0].images : [no_image])
      setPriceValue(availableNets[0].price)
      setMaxQuantityValue(availableNets[0].quantity)
      setQuantityValue(availableNets[0].quantity != 0 ? 1 : 0)
    } else {
      setImages(null)
    }
  }, [disabledSelects])

  let propertyLabels = {
    'width': 'Ширина',
    'length': 'Длина',
    'color': 'Цвет',
    'thickness': 'Толщина',
  }

  useEffect(() => {
    let selectNetValues = {...getSelectedProperties(), cell: nets[0].cell, quantity: parseInt(quantityValue), price: priceValue*quantityValue}
    setSelectNetValues(selectNetValues)
  }, [quantityValue, priceValue, availableNets, availableProperties])

  return (
    <div className={styles.Card__properties}>
      {propertiesOrder.map(property => 
        <div className={styles.Card__property} key={property}>
          <strong>{propertyLabels[property]}</strong>
          <div className={styles.underline}></div>
          <MuiSelect ref={selectsRefs[property]} disabled={disabledSelects[property]} getSelectSetOption={getSelectSetOption} availableVariantsOfProperty={availableProperties ? availableProperties[property] : false} property={property} onChangeSelect={onChangeSelect} netsProperties={netsProperties}/>
        </div>
      )}
      <div className={`${styles.Card__property} ${styles.Card__additionalProperty}`}>
        <strong>Количество</strong>
        <div className={styles.underline}></div>
        <LimitedTextField maxValue={maxQuantityValue} value={quantityValue} setValue={setQuantityValue} className={styles.Card__property_input}/>
      </div>
      <div className={`${styles.Card__property} ${styles.Card__additionalProperty}`}>
        <strong>Стоимость</strong>
        <div className={styles.underline}></div>
        <p>{priceValue*quantityValue}₽</p>
      </div>
    </div>
  )
}