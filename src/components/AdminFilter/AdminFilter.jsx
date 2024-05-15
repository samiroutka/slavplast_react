import React, { useEffect, useRef, useState } from 'react'
import styles from './AdminFilter.module.scss'
import { AdminCardSelect } from '@/components/AdminCardSelect/AdminCardSelect'
import { AdminRangeInput } from '@/components/AdminRangeInput/AdminRangeInput';
import { Button } from '@mui/material'

let AdminFilterSelects = ({netType, config, cleannessTest}) => {
  let selectsProperties = ['length', 'width', 'cell', netType == 'plastic' ? 'color' : 'thickness']
  return (
    <>
      {selectsProperties.map(property => 
        <AdminCardSelect key={property} cleannessTest={cleannessTest} className={`${styles.AdminFilter__filter} ${styles.AdminFilter__filterSelect}`} variants={config[property]} property={property}/>  
      )}
    </>
  )
}

export const AdminFilter = ({netType, config, searchOnClick, clearOnClick}) => {
  let [priceMin, setPriceMin] = useState('')
  let [priceMax, setPriceMax] = useState('')
  let [quantityMin, setQuantityMin] = useState('')
  let [quantityMax, setQuantityMax] = useState('')
  let [cleannessTest, setCleannessTest] = useState(false)

  useEffect(() => {
    if (cleannessTest) {
      setPriceMin('')
      setPriceMax('')
      setQuantityMin('')
      setQuantityMax('')
      setCleannessTest(false) // чтобы заново можно было установить на true
    }
  }, [cleannessTest])

  return (
    <div className={styles.AdminFilter}>
      <AdminFilterSelects netType={netType} cleannessTest={cleannessTest} className={styles.AdminFilter__filter} config={config}/>
      <AdminRangeInput value1={priceMin} value1Set={setPriceMin} value2={priceMax} value2Set={setPriceMax} label1='цена от' label2='цена до'/>
      <AdminRangeInput value1={quantityMin} value1Set={setQuantityMin} value2={quantityMax} value2Set={setQuantityMax} label1='остатки от' label2='остатки до'/>
      <Button size='small' variant='contained' onClick={searchOnClick ? () => {
        let selectsValues = {}
        for (let select of document.querySelectorAll(`.${styles.AdminFilter__filterSelect}`)) {
          selectsValues[select.querySelector('label').id] = parseInt(select.querySelector('input').value)
        }
        let values = {
          price: `${priceMin}-${priceMax}` == '-' ? false : `${priceMin}-${priceMax}`,
          quantity: `${quantityMin}-${quantityMax}` == '-' ? false : `${quantityMin}-${quantityMax}`,
          ...selectsValues}
        for (let [key, value] of Object.entries(values)) {
          if (!value) {
            delete values[key]
          }
        }
        searchOnClick(values)
      } : () => {}}>найти</Button>
      <Button size='small' variant='outlined' color='error' onClick={clearOnClick ? () => {
        let clearFilters = () => {
          setCleannessTest(true)
        }
        clearOnClick(clearFilters)
      } : () => {}}>очистить</Button>
    </div>
  )
}
