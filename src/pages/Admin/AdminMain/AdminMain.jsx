import React, {useRef} from 'react'
import styles from './AdminMain.module.scss'
import { AdminNets } from '@/components/AdminNets/AdminNets.jsx';
import { Button } from '@mui/material';
import { Tab, TabsList, TabPanel, Tabs } from '@mui/base';

export const AdminMain = () => {
  let tabsListRef = useRef()

  return (
    <Tabs className={styles.AdminMain__Tabs} defaultValue={'plastic'}>
      <TabsList ref={tabsListRef} className={styles.AdminMain__TabsList}>
        <Tab className={styles.AdminMain__Tab} value={'plastic'}><Button className={styles.AdminMain__TabButton} variant="outlined">Пластиковая</Button></Tab>
        <Tab className={styles.AdminMain__Tab} value={'knotless'}><Button className={styles.AdminMain__TabButton} variant="outlined">Безузелковая</Button></Tab>
      </TabsList> 
      <TabPanel value={'plastic'}><AdminNets type='plastic'/></TabPanel>
      <TabPanel value={'knotless'}><AdminNets type='knotless'/></TabPanel>
    </Tabs>
  )
}
