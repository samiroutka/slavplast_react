import React, {useState} from 'react'
import styles from './Card.module.scss'
import { useParams, useLocation } from 'react-router';
// ----------swiper----------
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
// -------------------------
import { Header } from '@/components/Header/Header';
import square from './images/square.svg'
import test_img from './images/test_img.jpg'
import { InputLabel, MenuItem, FormControl } from '@mui/material';
import Select from '@mui/material/Select';

const Swiper_slider = () => {
  // let image_url = 'https://buffer.com/cdn-cgi/image/w=1000,fit=contain,q=90,f=auto/library/content/images/size/w600/2023/09/instagram-image-size.jpg'
  let image_url = test_img

  return (
    <Swiper className={styles.Card__swiper}
    modules={[Navigation, Pagination]}
    spaceBetween={50}
    slidesPerView={1}
    navigation
    pagination={{ clickable: true }}
    onSwiper={(swiper) => console.log(swiper)}
    onSlideChange={() => console.log('slide change')}>
      <SwiperSlide><img src={image_url} alt="" /></SwiperSlide>
      <SwiperSlide><img src={image_url} alt="" /></SwiperSlide>
      <SwiperSlide><img src={image_url} alt="" /></SwiperSlide>
    </Swiper>
  )
} 

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
        <Swiper_slider/>
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
