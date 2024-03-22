import React, { useEffect, useState } from 'react'
import styles from './AdminNets.module.scss'
import {Loader} from '@/components/Loader/Loader';
import { useNavigate } from 'react-router'
import {Button} from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';

export const AdminNets = ({type}) => {
  let apiUrl = import.meta.env.VITE_APIURL
  let navigateTo = useNavigate()
 
  let [nets, setNets] = useState()
  let [config, setConfig] = useState()

  let getNets = async () => {
    let response = await fetch(`${apiUrl}/nets`)
    setNets(await response.json())
  }
  let getConfig = async () => {
    let response = await fetch(`${apiUrl}/config`)
    setConfig(await response.json())
  }
  let getData_wrapper = async () => {
    await getNets()
    await getConfig()
  }

  let getNetData_byConfig = (config, net, type) => {
    return config[type].filter(item => item.id == net[type])[0][type]
  }

  useEffect(() => {
    getData_wrapper()
  }, [])

  return (
    <section>
      {!(config && nets) ? <Loader/> :
        <>
          <h1>{type == 'plastic' ? 'Пластиковая' : type == 'knotless' ? 'Безузелковая' : ''}</h1>
          <Button variant='contained' startIcon={<AddIcon/>} className={styles.AdminNets__addNet} onClick={() => navigateTo('/admin/card/add')}>Добавить сетку</Button>
          <Button variant='outlined' startIcon={<EditIcon/>} className={styles.AdminNets__changeConfig} onClick={() => navigateTo('/admin/config')}>Изменить конфигурацию</Button>
          <h3 className={styles.AdminNets__netTitle}>Сетки</h3>
          {nets.length != 0 ?
            <div className={styles.AdminNets__nets}>
              <div className={styles.AdminNets__net_titles}>
                <p>длина</p>
                <p>ширина</p>
                <p>ячейки</p>
                <p>цвет</p>
              </div>
              {nets.map(net => 
                <div className={styles.AdminNets__net} key={net.id} onClick={() => {navigateTo(`/admin/card/${net.id}`)}}>
                  <p>{getNetData_byConfig(config, net, 'length')}</p>
                  <p>{getNetData_byConfig(config, net, 'width')}</p>
                  <p>{getNetData_byConfig(config, net, 'cell')}</p>
                  <p>{getNetData_byConfig(config, net, 'color')}</p>
                </div>
              )}
            </div>
          :<p>Сеток нету (</p>}
        </>
      }
    </section>
  )
}