import React, {useState} from 'react'
import styles from './Card.module.scss'
import { useParams, useLocation } from 'react-router';
// -------------------------
import { Header } from '@/components/Header/Header'
import test_img from './images/test_img.jpg'
import { Slider } from '@/components/Slider/Slider'
import { InputLabel, MenuItem, FormControl } from '@mui/material';
import Select from '@mui/material/Select';

const MuiSelect = ({options}) => {
  const [option, setOption] = useState(0)

  return (
    <FormControl variant="standard" fullWidth className={styles.Card__muiLabel}>
      {/* <InputLabel id="demo-simple-select-label"></InputLabel> */}
      <Select
        // labelId="demo-simple-select-label"
        // id="demo-simple-select"
        value={option}
        onChange={(event) => {setOption(event.target.value)}}>
        {options.map(option => {return (
          <MenuItem value={options.indexOf(option)}>{option}</MenuItem>
        )})}
      </Select>
    </FormControl>
  )
}

export const Card = () => {
  let {card} = useParams()
  let properties = {
    'length': ['10м', '15м', '20м'],
    'width': ['1м', '2м', '5м', '10м'],
    'color': ['зеленый', 'желтый'],
  }

  return (
    <>
      <Header/>
      <section className={styles.Card}>
        <Slider images={[test_img, test_img, test_img]}/>
        <div className={styles.Card__description}>
          <h1>Сетка садовая пластиковая {card}мм</h1>
          <div className={styles.Card__properties}>
            <div className={styles.Card__property}>
              <strong>Длина</strong>
              <div className={styles.underline}></div>
              <MuiSelect options={properties['length']}/>
            </div>
            <div className={styles.Card__property}>
              <strong>Ширина</strong>
              <div className={styles.underline}></div>
              <MuiSelect options={properties['width']}/>
            </div>
            <div className={styles.Card__property}>
              <strong>Цвет</strong>
              <div className={styles.underline}></div>
              <MuiSelect options={properties['color']}/>
            </div>
          </div>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias alias veniam labore, sapiente totam ipsum? Eum vero laborum adipisci unde, doloribus natus enim, voluptatibus alias facilis modi fuga laudantium nostrum, doloremque ipsa officiis similique fugiat. Doloremque sequi sit animi eaque asperiores? Hic iure sunt inventore harum error quod quasi dolore?</p>
        </div>
      </section>
    </>
  )
}
