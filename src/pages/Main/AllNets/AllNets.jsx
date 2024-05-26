import React from 'react'
import styles from './AllNets.module.scss'
import { AdminNets } from '@/components/AdminNets/AdminNets'
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
      <AdminNets editaeble={false} adminNetsHeader={false} title={netTypeLabels[netType]}/>
    </>
  )
}
