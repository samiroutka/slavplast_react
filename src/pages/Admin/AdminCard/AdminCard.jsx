import React, { useEffect, useRef, useState } from 'react'
import { useParams, useLocation } from 'react-router';
import { useNavigate } from 'react-router'
import styles from './AdminCard.module.scss'
import {Button} from '@mui/material'
import {TextField, InputAdornment, Select, MenuItem, FormControl, InputLabel, Alert, 
CircularProgress} from '@mui/material'
import { Loader } from '@/components/Loader/Loader';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { MyAlert, showAlert } from '@/components/Alert/MyAlert';

let getVariantKey = (variant) => {
  let new_variant = {...variant}
  delete new_variant['id']
  return Object.keys(new_variant)[0]
}

let deleteId_fromNet = (net) => {
  let new_net = {...net}
  delete new_net['id']
  return new_net
}

const AdminCardInput = ({variants, net, config}) => {
  let current_variantKey = getVariantKey(variants[0])
  let netVariantId = net ? config[current_variantKey].filter(variant => variant.id == net[current_variantKey])[0]['id'] : null
  let labels = {
    'length': 'Длина',
    'width': 'Ширина',
    'cell': 'Ячейка',
    'color': 'Цвет',
    'thickness': 'Толщина',
  }
  let input_id = `${current_variantKey}`
  let [selectValue, setSelectValue] = useState(net ? netVariantId : '')
  const handleChange = (event) => {
    setSelectValue(event.target.value);
  };

  return (
    <div className={styles.AdminCard__input}>
      <FormControl sx={{width: '100%'}} variant="filled">
        <InputLabel id={input_id}>{labels[current_variantKey]}</InputLabel>
        <Select
          labelId={`${input_id}_label`}
          id={input_id}
          value={selectValue}
          onChange={handleChange}
        >
          {variants.map(variant => 
              <MenuItem key={variant.id} value={variant.id}>{variant[getVariantKey(variant)]}</MenuItem>
          )}
        </Select>
      </FormControl>
    </div>
  )
}

// -----------------------------------------------------

export const AdminCard = () => {
  let {id} = useParams()
  let {netType} = useParams()
  let apiUrl = import.meta.env.VITE_APIURL
  let navigateTo = useNavigate()
  let [net, setNet] = useState()
  let [config, setConfig] = useState()
  let [configValidation, setConfigValidation] = useState()

  let alertRefs = {
    'validation': useRef(),
    'error': useRef(),
  }

  let getNet = async () => {
    let response = await fetch(`${apiUrl}/net/${netType}/${id}`)
    response.ok ? setNet(await response.json()) : showAlert(alertRefs['error'].current)
  }

  let getData_wrapper = async () => {
    await getConfig()
    id ? await getNet() : null
  }

  let getConfig = async () => {
    let response = await fetch(`${apiUrl}/config/${netType}`)
    let responseData = await response.json()
    response.ok ? setConfig(responseData) : setConfig(false)
    setConfigValidation(Boolean(Object.keys(responseData).length == 4))
  }

  let getValues = () => {
    let values = {}
    for (let input of document.querySelector(`.${styles.AdminCard__inputs}`).children){
      let value = input.querySelector('input').value
      if (!value) {return false}
      values[input.querySelector('label').id] = value
    }
    return values
  }

  let addOrUpdateNet = async (type) => {
    let values = getValues()
    if (!values) {
      showAlert(alertRefs['validation'].current)
      return false
    }
    let response = await fetch(type == 'add' ? `${apiUrl}/net/${netType}` : `${apiUrl}/net/${netType}/${id}`, {
      method: type == 'add' ? 'post' : 'put',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(getValues())
    })
        response.ok ? navigateTo(`/admin/${netType}`) : showAlert(alertRefs['error'].current)
  }

  let deleteNet = async () => {
    let respose = await fetch(`${apiUrl}/net/${netType}/${id}`, {method: 'delete'})
    respose.ok ? navigateTo(`/admin/${netType}`) : showAlert(alertRefs['error'].current)
  }

  useEffect(() => {
    getData_wrapper()
  }, [])

  return (
    <>
    {id && !net ? <Loader/> : !config ? <Loader/>
    :
      <section className={styles.AdminCard}>
        <h1>Добавить сетку</h1>
        <div className={styles.AdminCard__inputs}>
          {!id ? 
            config && configValidation ? Object.keys(config).map(item => 
              <AdminCardInput key={getVariantKey(config[item][0])} variants={config[item]}/>
            ) : <p>Добавьте варианты в <a href={`/admin/${netType}/config`}>конфигурации</a></p>
          : net ? Object.keys(deleteId_fromNet(net)).map(item => 
            <AdminCardInput key={item} variants={config[item]} net={deleteId_fromNet(net)} config={config}/>
          ) : <></>}
        </div>
        <MyAlert ref={alertRefs['validation']} severity="info">Заполните все поля</MyAlert>
        <MyAlert ref={alertRefs['error']} severity="error">Что-то пошло не так</MyAlert>
        {configValidation?
            id ? <>
                 <Button variant='contained' startIcon={<EditIcon/>} className={styles.AdminCard_saveButton} onClick={() => addOrUpdateNet('update')}>Сохранить</Button>
                 <Button variant='contained' startIcon={<DeleteIcon/>} className={styles.AdminCard_deleteButton} onClick={deleteNet}>Удалить</Button>
               </>
             : <Button variant='contained' startIcon={<AddIcon/>} className={styles.AdminCard_addButton} onClick={() => addOrUpdateNet('add')}>Добавить</Button> 
        : <></>}
      </section>} 
    </>
  )
}
