import React, { useEffect, useRef, useState } from 'react'
import {Button, TextField, InputAdornment, Select, MenuItem, FormControl, InputLabel, Alert} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { Loader } from '@/components/Loader/Loader'
import DeleteIcon from '@mui/icons-material/Delete';
import styles from './AdminConfig.module.scss'
import {MyAlert, showAlert} from '@/components/Alert/MyAlert'

export const AdminConfig = () => {
  let apiUrl = import.meta.env.VITE_APIURL

  let lengthRef = useRef()
  let widthRef = useRef()
  let cellRef = useRef()
  let colorRef = useRef()
  
  let alertValidationRef = useRef()

  let [config, setConfig] = useState(false)
  let [isLoading, setIsLoading] = useState(false)

  let getConfig = async () => {
    let response = await fetch(`${apiUrl}/config`)
    setConfig(await response.json()) ? response.ok : null
  }

  let cleanFields = () => {
    for (let ref of [lengthRef, widthRef, cellRef, colorRef]) {
      ref.current.querySelector('input').value = ''
    }
  }

  let getValues = () => {
    let refs = {'length': lengthRef, 'width': widthRef, 'cell': cellRef, 'color': colorRef}
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
    let response = await fetch(`${apiUrl}/config`, {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(values)
    })
    await getConfig()
    cleanFields()
    setIsLoading(false)
  }

  let deleteItem = async (item) => {
    setIsLoading(true)
    let type = Object.keys(item)
    type.splice(type.indexOf('id'), 1)
    type = type[0]
    let response = await fetch(`${apiUrl}/config/${type}/${item.id}`, {method: 'delete'})
    await getConfig()
    cleanFields()
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
            <div className={styles.AdminConfig__input}>
              <TextField ref={lengthRef} sx={{width: '100%'}} label="Длина" variant="filled" type="number" placeholder='5' InputProps={{
                  startAdornment: <InputAdornment position="start">м</InputAdornment>,
              }}/>
            </div>
            <div className={styles.AdminConfig__input}>
              <TextField ref={widthRef} sx={{width: '100%'}} label="Ширина" variant="filled" type="number" placeholder='3' InputProps={{
                  startAdornment: <InputAdornment position="start">м</InputAdornment>,
              }}/>
            </div>
            <div className={styles.AdminConfig__input}>
              <TextField ref={cellRef} sx={{width: '100%'}} label="Размер ячейки" variant="filled" type="string" placeholder='10x15' InputProps={{
                  startAdornment: <InputAdornment position="start">мм</InputAdornment>,
              }}/>
            </div>          
            <div className={styles.AdminConfig__input}>
              <TextField ref={colorRef} sx={{width: '100%'}} label="Цвет" variant="filled" type="string" placeholder='зеленый'/>
            </div>
          </div>
          <div className={styles.AdminConfig}>
              <div className={styles.AdminConfig__column}>
                {config['length'] ? config['length'].map(item => 
                  <div className={styles.AdminConfig__row} key={item.id}>
                    <p>{item.length}</p>
                    <DeleteIcon className={styles.AdminConfig__deleteButton} onClick={() => {deleteItem(item)}}/>
                  </div>
                ): <span>-</span>}
              </div>
              <div className={styles.AdminConfig__column}>
                {config['width'] ? config['width'].map(item => 
                  <div className={styles.AdminConfig__row} key={item.id}>
                    <p>{item.width}</p>
                    <DeleteIcon className={styles.AdminConfig__deleteButton} onClick={() => {deleteItem(item)}}/>
                  </div>
                ): <span>-</span>}
              </div>
              <div className={styles.AdminConfig__column}>
                {config['cell'] ? config['cell'].map(item => 
                  <div className={styles.AdminConfig__row} key={item.id}>
                    <p>{item.cell}</p>
                    <DeleteIcon className={styles.AdminConfig__deleteButton} onClick={() => {deleteItem(item)}}/>
                  </div>
                ): <span>-</span>}
              </div>
              <div className={styles.AdminConfig__column}>
                {config['color'] ? config['color'].map(item => 
                  <div className={styles.AdminConfig__row} key={item.id}>
                    <p>{item.color}</p>
                    <DeleteIcon className={styles.AdminConfig__deleteButton} onClick={() => {deleteItem(item)}}/>
                  </div>
                ): <span>-</span>}
              </div>
          </div>
          <Button variant='contained' startIcon={<AddIcon/>} className={styles.AdminConfig_saveButton} onClick={addConfig}>Добавить</Button>
        </>}
        <MyAlert ref={alertValidationRef} severity="info">Заполните хотя бы одно поле</MyAlert>
    </section>
  )
}
