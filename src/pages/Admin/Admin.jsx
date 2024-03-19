import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import styles from './Admin.module.scss'
import {Button} from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { Loader } from '@/components/Loader/Loader';

export const Admin = () => {
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
          <Button variant='contained' startIcon={<AddIcon/>} className={styles.Admin__addNet} onClick={() => navigateTo('/admin/card/add')}>Добавить сетку</Button>
          <Button variant='outlined' startIcon={<EditIcon/>} className={styles.Admin__changeConfig} onClick={() => navigateTo('/admin/config')}>Изменить конфигурацию</Button>
          <h1>Сетки</h1>
          {nets.length != 0 ?
            <div className={styles.Admin_nets}>
              <div className={styles.Admin_net_titles}>
                <p>длина</p>
                <p>ширина</p>
                <p>ячейки</p>
                <p>цвет</p>
              </div>
              {nets.map(net => 
                <div className={styles.Admin_net} key={net.id} onClick={() => {navigateTo(`/admin/card/${net.id}`)}}>
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
