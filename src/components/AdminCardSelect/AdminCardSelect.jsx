
import React, { useEffect, useState } from 'react'
import styles from './AdminCardSelect.module.scss'
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material'

export const AdminCardSelect = React.forwardRef(({className, cleannessTest, variants, net, property}, ref) => {
  let netVariantId = net ? variants.filter(variant => variant.id == net[property])[0]['id'] : null
  let labels = {
    'length': 'Длина',
    'width': 'Ширина',
    'cell': 'Ячейка',
    'color': 'Цвет',
    'thickness': 'Толщина',
  }
  let input_id = `${property}`
  let [selectValue, setSelectValue] = useState(net ? netVariantId : '')
  const handleChange = (event) => {
    setSelectValue(event.target.value);
  };

  useEffect(() => {
    cleannessTest ? setSelectValue('') : null
  }, [cleannessTest])

  return (
    <div className={`${styles.AdminCardSelect} ${className ? className : ''}`}>
      <FormControl ref={ref} sx={{width: '100%'}} variant="filled">
        <InputLabel id={input_id}>{labels[property]}</InputLabel>
        <Select
          labelId={`${input_id}_label`}
          id={input_id}
          value={selectValue}
          onChange={handleChange}
        >
          {variants.map(variant => 
              <MenuItem key={variant.id} value={variant.id}>{variant[property]}</MenuItem>
          )}
        </Select>
      </FormControl>
    </div>
  )
})