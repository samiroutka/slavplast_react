import React, { useEffect, useRef, useState } from 'react'
import {Button, TextField, InputAdornment, Select, MenuItem, FormControl, InputLabel, Alert} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { Loader } from '@/components/Loader/Loader'
import DeleteIcon from '@mui/icons-material/Delete';
import styles from './AdminConfig.module.scss'
import {MyAlert, showAlert, closeAlert} from '@/components/Alert/MyAlert'
import { useParams } from 'react-router';

export const AdminConfig = () => {
  
  const AdminInput = React.forwardRef(({label, type, placeholder, unit}, ref) => {
    return (
      <div className={styles.AdminConfig__input}>
        <TextField ref={ref} sx={{width: '100%'}} label={label} variant="filled" type={type} placeholder={placeholder}
        InputProps={unit ? {
          startAdornment: <InputAdornment position="start">{unit}</InputAdornment>,
        } : {}}/>
      </div>
    )
  })

  const AdminColumn = ({type}) => { 
    return (
      <div className={styles.AdminConfig__column}>
        {config[type] ? config[type].map(item => 
          <div className={styles.AdminConfig__row} key={item['id']}>
            <p>{item[type]}</p>
            <DeleteIcon className={styles.AdminConfig__deleteButton} onClick={() => {deleteItem(item)}}/>
          </div>
        ): <span>-</span>}
      </div>
    )
  }
  
  // -------------------------------------------------------------------------------

  let apiUrl = import.meta.env.VITE_APIURL
  let {netType} = useParams()

  let lengthRef = useRef()
  let widthRef = useRef()
  let cellRef = useRef()
  let colorRef = useRef()
  let thicknessRef = useRef()
  
  let alertValidationRef = useRef()
  let alertExistingNetRef = useRef()

  let [config, setConfig] = useState(false)
  let [isLoading, setIsLoading] = useState(false)

  let getConfig = async () => {
    let response = await fetch(`${apiUrl}/config/${netType}`)
    setConfig(await response.json()) ? response.ok : null
  }

  let cleanFields = () => {
    if (netType == 'plastic'){
      for (let ref of [lengthRef, widthRef, cellRef, colorRef]) {
        ref.current.querySelector('input').value = ''
      }
    } else if (netType == 'knotless') {
      for (let ref of [lengthRef, widthRef, cellRef, thicknessRef]) {
        ref.current.querySelector('input').value = ''
      }
    }
  }

  let getValues = () => {
    let refs = netType == 'plastic' ? {'length': lengthRef, 'width': widthRef, 'cell': cellRef, 'color': colorRef} : 
    netType == 'knotless' ? {'length': lengthRef, 'width': widthRef, 'cell': cellRef, 'thickness': thicknessRef} : null
    let values = {}
    for (let ref in refs) {
      let refValue = refs[ref].current.querySelector('input').value
      if (refValue) {
        values[ref] = refValue
      }
    }
    return values
  }

  let addConfig = async () => {
    let values = getValues()
    if (!Object.keys(values).length){
      showAlert(alertValidationRef.current)
      return false
    }
    setIsLoading(true)
    let response = await fetch(`${apiUrl}/config/${netType}`, {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(values)
    })
    await getConfig()
    cleanFields()
    setIsLoading(false)
  }

  let [itemForDelete, setItemForDelete] = useState()

  let deleteItem = async (item, query) => {
    setIsLoading(true)
    let type = Object.keys(item)
    type.splice(type.indexOf('id'), 1)
    type = type[0]
    let response = await fetch(`${apiUrl}/config/${netType}/${type}/${item.id}${query ? query : ''}`, {method: 'delete'})
    if (!await response.json()) {
      showAlert(alertExistingNetRef.current, 4000)
      setItemForDelete(item)
    }
    await getConfig()
    setIsLoading(false)
  }

  useEffect(() => {
    getConfig()
  }, [])

  return (
    <section>
      {!config ? <Loader/> :
        <>
          {isLoading ? <Loader/> : false}
          <h1>Изменить конфигурацию</h1>
          <div className={styles.AdminCard__inputs}>
            <AdminInput ref={lengthRef} label='Длина' type='number' placeholder='8' unit='м'/>
            <AdminInput ref={widthRef} label='Ширина' type='number' placeholder='5' unit='м'/>
            <AdminInput ref={cellRef} label='Ячейка' type='string' placeholder='15x10' unit='мм'/>
            {netType == 'plastic' ? 
              <AdminInput ref={colorRef} label='Цвет' type='string' placeholder='красный'/>
            : netType == 'knotless' ?
              <AdminInput ref={thicknessRef} label='Толщина' type='string' placeholder='4' unit='мм'/>
            : <></>}
          </div>
          <div className={styles.AdminConfig}>
            <AdminColumn type='length'/>
            <AdminColumn type='width'/>
            <AdminColumn type='cell'/>
            {netType == 'plastic' ? 
              <AdminColumn type='color'/>
            : netType == 'knotless' ?
            <AdminColumn type='thickness'/>
            : <></>}
          </div>
          <Button variant='contained' startIcon={<AddIcon/>} className={styles.AdminConfig_saveButton} onClick={addConfig}>Добавить</Button>
        </>}
        <MyAlert ref={alertValidationRef} severity="info">Заполните хотя бы одно поле</MyAlert>
        <MyAlert ref={alertExistingNetRef} severity="info" actionText='уверен(а)' actionCallback={async () => {
          await deleteItem(itemForDelete, `?force=${true}`)
          closeAlert(alertExistingNetRef.current)
          }}>С этой конфигурацией уже есть сетк(а/и). Вы уверены что хотите удалить сетк(а/и) с этой конфигурацией</MyAlert>
    </section>
  )
}
