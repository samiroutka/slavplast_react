import React, { useEffect } from 'react'
import styles from './Slider.module.scss'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import { Button } from '@mui/material';

export const Slider = (props) => {
  let {images, deleteCallback} = props

  return (
    <Swiper className={`${styles.Slider} ${props.className ? props.className : ''}`}
    modules={[Navigation, Pagination]}
    spaceBetween={50}
    slidesPerView={1}
    navigation
    pagination={{ clickable: true }}
    onSwiper={() => {}}
    onSlideChange={() => {}}>
      {images.map(image => 
        <SwiperSlide className={styles.Slider__slider} key={images.indexOf(image)+Math.round(Math.random()*10)}>
          <img src={image} alt=""/>
          {deleteCallback ? 
            <Button className={styles.Slider__deleteButton} onClick={deleteCallback}><DeleteRoundedIcon className={styles.Slider__deleteIcon}/></Button>
          : <></>}
        </SwiperSlide>
      )}
      {/* <SwiperSlide><img src='http://localhost:5000/file/tomb_raider.jpg' alt="" /></SwiperSlide> */}
      {/* <SwiperSlide><img src='http://localhost:5000/file/tomb_raider.jpg' alt="" /></SwiperSlide> */}
    </Swiper>
  )
} 