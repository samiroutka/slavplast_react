import React, { useEffect, useRef, useState } from 'react'
import { useParams, useLocation } from 'react-router';
import { useNavigate } from 'react-router'
import styles from './AdminCard.module.scss'
import { Button } from '@mui/material'
import { AdminCardSelect } from '@/components/AdminCardSelect/AdminCardSelect';
import { AdminCardInput } from '@/components/AdminCardInput/AdminCardInput.jsx';
import { Slider } from '@/components/Slider/Slider.jsx'
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import { Loader } from '@/components/Loader/Loader';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { MyAlert, showAlert } from '@/components/Alert/MyAlert';
import noimage from './noimage.png'

let getSelectFields = (net) => {
  let new_net = {...net}
  delete new_net['id']
  delete new_net['images']
  delete new_net['price']
  delete new_net['quantity']
  return new_net
}

let getVariantKey = (variant) => {
  let new_variant = getSelectFields(variant)
  return Object.keys(new_variant)[0]
}

const AdminCardInputs = ({inputsValues}) => {
  return (
    <>
      <AdminCardInput className={styles.AdminCard__input} id='price' label='Цена' defaultValue={inputsValues ? inputsValues.price : ''}/>
      <AdminCardInput className={styles.AdminCard__input} id='quantity' label='Остатки' defaultValue={inputsValues ? inputsValues.quantity : ''}/>
    </>
  )
}

// -----------------------------------------------------

export const AdminCard = () => {
  let {id} = useParams()
  let {netType} = useParams()
  let apiUrl = import.meta.env.VITE_APIURL
  let navigateTo = useNavigate()
  let [loading, setLoading] = useState(false)
  let [net, setNet] = useState()
  let [config, setConfig] = useState()
  let [configValidation, setConfigValidation] = useState()
  let [images, setImages] = useState([])

  let alertRefs = {
    'validation': useRef(),
    'error': useRef(),
  }

  let getNet = async () => {
    let response = await fetch(`${apiUrl}/net/${netType}/${id}`)
    let net_data = await response.json()
    response.ok ? setNet(net_data) : showAlert(alertRefs['error'].current)
    setImages(net_data['images'])
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
      values[input.querySelector('label').id.replace('-label', '')] = parseInt(value)
    }
    values['images'] = images
    return values
  }

  let getInputsValues = () => {
    let inputsValues = {}
    inputsValues['price'] = net.price
    inputsValues['quantity'] = net.quantity
    return inputsValues
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
      body: JSON.stringify(values)
    })
    response.ok ? navigateTo(`/admin/${netType}`) : showAlert(alertRefs['error'].current)
  }

  let deleteNet = async () => {
    let respose = await fetch(`${apiUrl}/net/${netType}/${id}`, {method: 'delete'})
    respose.ok ? navigateTo(`/admin/${netType}`) : showAlert(alertRefs['error'].current)
  }

  let uploadFile = async (event) => {
    setLoading(true)
    let formData = new FormData
    formData.append('file', event.target.files[0])
    let response = await fetch(`${apiUrl}/file`, {
      method: 'post',
      body: formData
    })
    let newImage = await response.json()
    setImages([...images, `${apiUrl}/${newImage}`])
    setLoading(false)
  }

  let deleteImage = async (event) => {
    setLoading(true)
    let filepath = event.currentTarget.parentElement.querySelector('img').src
    let filename = filepath.replace(`${apiUrl}/file/`, '')
    let new_images = [...images]
    new_images.splice(new_images.indexOf(filepath), 1)
    setImages(new_images)
    if (location.pathname.includes('add')) { // логика если страница добавления сетки
      await fetch(`${apiUrl}/file/${filename}`, {method: 'delete'})
    }
    setLoading(false)
  }

  useEffect(() => {
    getData_wrapper()
  }, [])

  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

  return (
    <>
    {id && !net ? <Loader/> : !config ? <Loader/>
    :
      <section className={styles.AdminCard}>
        {loading ? <Loader/> : <></>}
        <h1>Добавить сетку</h1>
        {configValidation ?
          <div className={styles.AdminCard__imagesWrapper}>
            {images.length > 0 ?
              <Slider className={styles.AdminCard__slider} images={images} deleteCallback={deleteImage}/>  
            : <img className={styles.AdminCard_noimage} src={noimage}/>}
            <Button className={styles.AdminCard_uploadFile} component="label" variant="contained" startIcon={<CloudUploadIcon />}>
              Добавить фото
              <VisuallyHiddenInput onChange={uploadFile} type="file" accept="image/*"/>
            </Button>
          </div> : <></>}
        <div className={styles.AdminCard__inputs}>
          {id ?
            <>
              {Object.keys(getSelectFields(net)).map(item => 
                <AdminCardSelect className={styles.AdminCard__input} key={item} variants={config[item]} net={getSelectFields(net)} property={getVariantKey(config[item][0])}/>
              )}
              <AdminCardInputs inputsValues={getInputsValues()}/>
            </>
          : configValidation ?
            <>
              {Object.keys(config).map(item => 
                <AdminCardSelect className={styles.AdminCard__input} key={getVariantKey(config[item][0])} variants={config[item]} property={getVariantKey(config[item][0])}/>
              )}
              <AdminCardInputs/>
            </>
            : <p>Добавьте варианты в <a href={`/admin/${netType}/config`}>конфигурации</a></p>}
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
