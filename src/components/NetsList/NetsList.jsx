import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router';
import styles from './NetsList.module.scss'
import { AdminFilter } from '@/components/AdminFilter/AdminFilter'; 
import { Loader } from '@/components/Loader/Loader';
import { useNavigate } from 'react-router'
import { Button } from '@mui/material'
import { ChangeableInput } from '@/components/ChangeableInput/ChangeableInput';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import noImage from './noImage.png'

export const NetsList = ({netUrlType = 'admin', editaeble = true, NetsListHeader = true, title = 'Сетки'}) => {
  let EditableProperty = ({net, property}) => {
    let [value, setValue] = useState(getNetData_byConfig(net, property))
    let [isEdit, setIsEdit] = useState(false)

    return (
      <ChangeableInput type="number" className={styles.AdminNet__netField} onConfirm={async newValue => {
        let fetchObject = {}
        fetchObject[property] = parseInt(newValue)
        await fetch(`${apiUrl}/net/${netType}/${net.id}`, {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(fetchObject)
        })
        setValue(parseInt(newValue))
        setIsEdit(false)
      }} onEdit={() => setIsEdit(true)} isEdit={isEdit} defaultValue={value}/>
    )
  }

  // similar to range() in python
  const range = (start, end, step = 1) => Array.from({ length: Math.ceil((end - start) / step) }, (_, i) => start + i * step);

  let [netUrl, setNetUrl] = useState('')

  useEffect(() => {
    if (netUrlType == 'admin') {
      setNetUrl(`/admin/${netType}/card`)
    } else if (netUrlType == 'client') {
      setNetUrl(`/nets/${netType}`)
    }
  }, [])

  let apiUrl = import.meta.env.VITE_APIURL
  let {netType} = useParams()
  let navigateTo = useNavigate()
 
  let [allNets, setAllNets] = useState()
  let [nets, setNets] = useState()
  let [config, setConfig] = useState()

  let getNets = async () => {
    let response = await fetch(`${apiUrl}/nets/${netType}`)
    response = await response.json()
    setNets(response)
    setAllNets(response)
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
          {NetsListHeader ?
            <>
              <h1>{netType == 'plastic' ? 'Пластиковая' : netType == 'knotless' ? 'Безузелковая' : ''}</h1>
              <Button variant='contained' startIcon={<AddIcon/>} className={styles.NetsList__addNet} onClick={() => navigateTo(`/admin/${netType}/card/add`)}>Добавить сетку</Button>
              <Button variant='outlined' startIcon={<EditIcon/>} className={styles.NetsList__changeConfig} onClick={() => navigateTo(`/admin/${netType}/config`)}>Изменить конфигурацию</Button>  
            </> : null}
          <h2 className={styles.NetsList__netTitle}>{title}</h2>
          <AdminFilter netType={netType} config={config} searchOnClick={(values) => {
            let {price, quantity, ...selectValues} = values
            let newNets = Object.keys(values).length ? allNets.filter(net => {
              let test = true
              // проверка select фильтров
              for (let [key, value] of Object.entries(selectValues)) {
                if (net[key] != value) {
                  test = false
                  break
                }
              }
              // проверка range inputs фильтров
              for (let [key, value] of Object.entries({price, quantity})) {
                if (value) {
                  let rangeNumber1 = parseInt(value.split('-')[0])
                  let rangeNumber2 = parseInt(value.split('-')[1])+1 // +1 тк включая последний элемент
                  if (!range(rangeNumber1 ? rangeNumber1 : 0, rangeNumber2 ? rangeNumber2 : 100_000).includes(net[key])) {
                    test = false
                    break
                  }
                }
              }
              return test
            }) : null
            newNets ? setNets(newNets) : null
          }} clearOnClick={(clearFields) => {
            clearFields() // функция написана в AdminFilter
            setNets(allNets)
          }}/>
          {nets.length != 0 ?
            <div className={styles.NetsList__nets}>
              <div className={styles.NetsList__net_titles}>
                {['фото', 'длина', 'ширина', 'ячейки', netType == 'plastic' ? 'цвет' : netType == 'knotless' ? 'толщина' : null, 'цена', 'остатки'].map(label => 
                  <div key={label} className={styles.AdminNet__netField}>{label}</div>
                )}
              </div>
              {nets.map(net => 
                <div className={styles.NetsList__net} key={net.id} onClick={() => {navigateTo(`${netUrl}/${net.id}`)}}>
                  <img className={styles.AdminNet__netField} src={net.images[0] ? net.images[0] : noImage} alt='-'/>
                  {['length', 'width', 'cell', netType == 'plastic' ? 'color' : netType == 'knotless' ? 'thickness' : null].map(property =>
                    <div key={property} className={styles.AdminNet__netField}>{getNetData_byConfig(net, property)}</div>
                  )}
                  {editaeble ?
                    ['price', 'quantity'].map(property => 
                      <EditableProperty key={property} net={net} property={property}/>
                    ) :
                    ['price', 'quantity'].map(property => 
                      <div key={property} className={styles.AdminNet__netField}>{getNetData_byConfig(net, property)}</div>
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