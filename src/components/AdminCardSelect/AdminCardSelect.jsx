
import React, { useState, useEffect } from 'react'
import styles from './AdminCardSelect.module.scss'
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material'

export const AdminCardSelect = ({variants, net, config, getVariantKey}) => {
  // current_variantKey - length, width, cell и тд. То есть тип поля
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
    <div className={styles.AdminCardSelect}>
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