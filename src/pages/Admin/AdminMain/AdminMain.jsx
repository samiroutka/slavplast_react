import React, {useEffect, useRef} from 'react'
import { useNavigate, useParams } from 'react-router'
import styles from './AdminMain.module.scss'
import { NetsList } from '@/components/NetsList/NetsList.jsx';
import { Button } from '@mui/material';
import { Tab, TabsList, TabPanel, Tabs } from '@mui/base';

export const AdminMain = () => {
  let {netType} = useParams()
  let navigateTo = useNavigate()

  let plasticTabRef = useRef()
  let knotlessTabRef = useRef()

  useEffect(() => {
    plasticTabRef.current.click() ? netType == 'plastic' : netType == 'knotless' ? knotlessTabRef.current.click() : null
  }, [])

  return (
    <Tabs className={styles.AdminMain__Tabs} defaultValue={'plastic'}>
      <TabsList className={styles.AdminMain__TabsList}>
        <Tab ref={plasticTabRef} className={styles.AdminMain__Tab} value={'plastic'}><Button component='div' className={styles.AdminMain__TabButton} onClick={() => {navigateTo('/admin/plastic')}} variant="outlined">Пластиковая</Button></Tab>
        <Tab ref={knotlessTabRef} className={styles.AdminMain__Tab} value={'main'}><Button component='div' className={styles.AdminMain__TabButton} onClick={() => {navigateTo('/')}} variant="outlined">На главную</Button></Tab>
        <Tab ref={knotlessTabRef} className={styles.AdminMain__Tab} value={'knotless'}><Button component='div' className={styles.AdminMain__TabButton} onClick={() => {navigateTo('/admin/knotless')}} variant="outlined">Безузелковая</Button></Tab>
      </TabsList> 
      <TabPanel value={'plastic'}><NetsList/></TabPanel>
      <TabPanel value={'knotless'}><NetsList/></TabPanel>
    </Tabs>
  )
}
