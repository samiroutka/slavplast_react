import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router';
import styles from './AdminNets.module.scss'
import {Loader} from '@/components/Loader/Loader';
import { useNavigate } from 'react-router'
import { Button, TextField } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';

export const AdminNets = () => {
  let EditableProperty = ({net, property}) => {
    let [defaultValue, setDefaultValue] = useState(getNetData_byConfig(net, property))
    let [value, setValue] = useState(defaultValue)
    let [isInput, setIsInput] = useState(false)

    return (
      <div className={styles.AdminNet__netField} onClick={event => {event.stopPropagation()}}>
        {isInput ? <TextField onChange={event => setValue(event.target.value)} value={value} type='number'/> : defaultValue}
        <Button onClick={async () => {
          if (isInput) {
            let fetchObject = {}
            fetchObject[property] = parseInt(value)
            await fetch(`${apiUrl}/net/${netType}/${net.id}`, {
              method: 'put',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify(fetchObject)
            })
            setDefaultValue(parseInt(value))
            setIsInput(false)
          } else {
            setIsInput(true)
          }
        }}>{isInput ? <CheckIcon/> : <EditIcon/>}</Button>
      </div>
    )
  }

  let apiUrl = import.meta.env.VITE_APIURL
  let {netType} = useParams()
  let navigateTo = useNavigate()
 
  let [nets, setNets] = useState()
  let [config, setConfig] = useState()

  let getNets = async () => {
    let response = await fetch(`${apiUrl}/nets/${netType}`)
    setNets(await response.json())
  }
  let getConfig = async () => {
    let response = await fetch(`${apiUrl}/config/${netType}`)
    setConfig(await response.json())
  }
  let getData_wrapper = async () => {
    await getNets()
    await getConfig()
  }

  // Возвращает значение свойства по конфигу, если оно из конфига (price и quantity не по конфигу)
  let getNetData_byConfig = (net, type) => {
    if (config[type]) {
      return config[type].filter(item => item.id == net[type])[0][type]
    } else {
      return net[type]
    }
  }

  useEffect(() => {
    getData_wrapper()
    // На изменение url обнуляет config и занова запрашивает его
    window.navigation.addEventListener("navigate", async (event) => {
      setConfig(false)
      await getData_wrapper()
    })
  }, [])
  
  return (
    <section>
      {!(config && nets) ? <Loader/> :
        <>
          <h1>{netType == 'plastic' ? 'Пластиковая' : netType == 'knotless' ? 'Безузелковая' : ''}</h1>
          <Button variant='contained' startIcon={<AddIcon/>} className={styles.AdminNets__addNet} onClick={() => navigateTo(`/admin/${netType}/card/add`)}>Добавить сетку</Button>
          <Button variant='outlined' startIcon={<EditIcon/>} className={styles.AdminNets__changeConfig} onClick={() => navigateTo(`/admin/${netType}/config`)}>Изменить конфигурацию</Button>
          <h3 className={styles.AdminNets__netTitle}>Сетки</h3>
          {nets.length != 0 ?
            <div className={styles.AdminNets__nets}>
              <div className={styles.AdminNets__net_titles}>
                {['фото', 'длина', 'ширина', 'ячейки', netType == 'plastic' ? 'цвет' : netType == 'knotless' ? 'толщина' : null, 'цена', 'остатки'].map(label => 
                  <div key={label} className={styles.AdminNet__netField}>{label}</div>
                )}
              </div>
              {nets.map(net => 
                <div className={styles.AdminNets__net} key={net.id} onClick={() => {navigateTo(`/admin/${netType}/card/${net.id}`)}}>
                  <img className={styles.AdminNet__netField} src={net.images[0] ? net.images[0] : ''} alt='-'/>
                  {['length', 'width', 'cell', netType == 'plastic' ? 'color' : netType == 'knotless' ? 'thickness' : null].map(property =>
                    <div key={property} className={styles.AdminNet__netField}>{getNetData_byConfig(net, property)}</div>
                  )}
                  {['price', 'quantity'].map(property => 
                    <EditableProperty key={property} net={net} property={property}/>
                  )}
                </div>
              )}
            </div>
          :<p>Сеток нету (</p>}
        </>
      }
    </section>
  )
}