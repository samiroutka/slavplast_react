import React from 'react'
import styles from './AllNets.module.scss'
import { NetsList } from '@/components/NetsList/NetsList'
import { Header } from '@/components/Header/Header';
import { useParams } from 'react-router';

export const AllNets = () => {
  let {netType} = useParams()
  let netTypeLabels = {
    'plastic': 'Пластиковая',
    'knotless': 'Безузелковая',
  }

  return (
    <>
      <Header/>
      <NetsList netUrlType='client' editaeble={false} NetsListHeader={false} title={netTypeLabels[netType]}/>
    </>
  )
}
