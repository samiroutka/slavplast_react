import React, { useEffect, useRef, useState } from 'react'
import styles from './Card.module.scss'
import { useParams, useLocation } from 'react-router';
// -------------------------
import { Header } from '@/components/Header/Header'
import test_img from './images/test_img.jpg'
import { Loader } from '@/components/Loader/Loader.jsx'
import { Slider } from '@/components/Slider/Slider'
import { MenuItem, FormControl } from '@mui/material';
import Select from '@mui/material/Select';

export const Card = () => {
  const MuiSelect = React.forwardRef(({property, disabled, onChangeSelect, availableProperties, getSelectSetOption}, ref) => {
    const [option, setOption] = useState('')

    useEffect(() => {
      getSelectSetOption(setOption, property)
    }, [])

    useEffect(() => {
      option ? onChangeSelect(property) : null
    }, [option])

    return (
      <FormControl variant="standard" fullWidth className={styles.Card__muiLabel}>
        <Select
          disabled={disabled}
          ref={ref}
          value={option}
          onChange={(event) => {
            setOption(event.target.value)
          }}>
          {Object.entries(netsProperties[property]).map(([key, value]) => 
            <MenuItem key={key} value={key} disabled={availableProperties ? !availableProperties.includes(parseInt(key)) ? true : false : false}>{value}</MenuItem>
          )}
        </Select>
      </FormControl>
    )
  })

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

    let onChangeSelect = (selectProperty) => {
      // устанавливаем пустые value для нужных select
      for (let property of propertiesOrder.slice(propertiesOrder.indexOf(selectProperty)+1)) {
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
          checkAvailableProperties(selectProperty)
        }
      }
    }, [disabledSelects])

    return (
      <div className={styles.Card__properties}>
        <div className={styles.Card__property}>
          <strong>Длина</strong>
          <div className={styles.underline}></div>
          <MuiSelect ref={selectsRefs.length} disabled={disabledSelects.length} getSelectSetOption={getSelectSetOption} availableProperties={availableProperties ? availableProperties.length : false} property='length' onChangeSelect={onChangeSelect}/>
        </div>
        <div className={styles.Card__property}>
          <strong>Ширина</strong>
          <div className={styles.underline}></div>
          <MuiSelect ref={selectsRefs.width} disabled={disabledSelects.width} getSelectSetOption={getSelectSetOption} availableProperties={availableProperties ? availableProperties.width : false} property='width' onChangeSelect={onChangeSelect}/>
        </div>
        {netsProperties['color'] ?
          <div className={styles.Card__property}>
            <strong>Цвет</strong>
            <div className={styles.underline}></div>
            <MuiSelect ref={selectsRefs.color} disabled={disabledSelects.color} getSelectSetOption={getSelectSetOption} availableProperties={availableProperties ? availableProperties.color : false} property='color' onChangeSelect={onChangeSelect}/>
          </div>
        : <div className={styles.Card__property}>
            <strong>Толщина</strong>
            <div className={styles.underline}></div>
            <MuiSelect ref={selectsRefs.thickness} disabled={disabledSelects.thickness} getSelectSetOption={getSelectSetOption} availableProperties={availableProperties ? availableProperties.thickness : false} property='thickness' onChangeSelect={onChangeSelect}/>
          </div>}
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
      delete net['id']
      delete net['images']
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
    setNetsProperties(getNetsProperties(nets, config))
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <>
      <Header/>
      {!(nets && netsProperties) ? <Loader/> :
        <section className={styles.Card}>
          <Slider className={styles.Card__slider} images={[test_img, test_img, test_img]}/>
          <div className={styles.Card__description}>
            <h1>Сетка садовая {netType == 'plastic' ? 'пластиковая' : 'безузелковая'} {cell} мм</h1>
            <CardProperties/>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias alias veniam labore, sapiente totam ipsum? Eum vero laborum adipisci unde, doloribus natus enim, voluptatibus alias facilis modi fuga laudantium nostrum, doloremque ipsa officiis similique fugiat. Doloremque sequi sit animi eaque asperiores? Hic iure sunt inventore harum error quod quasi dolore?</p>
          </div>
        </section>}
    </>
  )
}
