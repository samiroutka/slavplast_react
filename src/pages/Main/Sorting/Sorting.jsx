import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { useParams, useLocation } from 'react-router';
import styles from './Sorting.module.scss'
import { Header } from '@/components/Header/Header';
import test_img from './images/test_img.jpg'
import { Loader } from '@/components/Loader/Loader.jsx'

export const Sorting = () => {
  let apiUrl = import.meta.env.VITE_APIURL
  let {netType} = useParams()
  let navigateTo = useNavigate()  
  let [cells, setCells] = useState()
  
  let getCells = async () => {
    let response = await fetch(`${apiUrl}/cells/${netType}`)
    setCells(await response.json())
  }
  
  useEffect(() => {
    getCells()
  }, [])
  
  return (
    <>
      <Header/>
      {!cells ? <Loader/> :
        cells.length > 0 ? 
        <section className={styles.Sorting}>
          <h2 className='title'>Ячейки</h2>
          <div className={styles.Sorting__cells}>
            <div onClick={() => navigateTo(`/allnets/${netType}`)} className={styles.Sorting__element}>
              <p>все сетки</p>
            </div>
            {cells.map(cell => 
              <div className={styles.Sorting__element} key={cell.id} onClick={() => {
                navigateTo(`/cards/${netType}/${cell.id}/${cell.cell}`)
              }}>
                <img src={test_img} alt="" />
                <p>{cell.cell}</p>
              </div>
            )}
          </div>
        </section>
      : <p>Никаких ячеек пока нету (</p>}
    </>
  )
}
