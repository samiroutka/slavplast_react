import React from 'react'
import { useNavigate } from 'react-router'
import { useParams, useLocation } from 'react-router';
import styles from './Sorting.module.scss'
import { Header } from '@/components/Header/Header';
import test_img from './images/test_img.jpg'

export const Sorting = () => {
  let navigateTo = useNavigate()  
  let {type} = useParams()
  let cells = [
    '5x5',
    '5x5',
    '6x6',
    '6x6',
    '10x10',
    '10x10',
    '11x11',
    '11x11',
    '12x12',
    '12x12',
    '13x13',
    '13x13',
    '15x15',
  ]

  return (
    <>
      <Header/>
      <section className={styles.Sorting}>
        {cells.map(cell => { return(
          <div className={styles.Sorting__element} onClick={() => {
            navigateTo(`/cards/${cell}`)
          }}>
            <img src={test_img} alt="" />
            <p>{cell}</p>
          </div>
        )})}
      </section>
    </>
  )
}
