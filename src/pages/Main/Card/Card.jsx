import React, { useEffect, useRef, useState, memo } from 'react'
import styles from './Card.module.scss'
import { useParams } from 'react-router';
import { Header } from '@/components/Header/Header'
import { Loader } from '@/components/Loader/Loader.jsx'
import { Slider } from '@/components/Slider/Slider'
import { CardProperties } from '@/components/CardProperties/CardProperties.jsx'

export const Card = () => {
  let apiUrl = import.meta.env.VITE_APIURL
  let {netType, cellId, cell} = useParams()
  let [nets, setNets] = useState()
  let [netsProperties, setNetsProperties] = useState()

  let getNetsProperties = (nets, config) => {
    let newNetsProperties = {}
    for (let net of nets) {
      for (let unnecessaryProperty of ['id', 'images', 'price', 'quantity']) {
        delete net[unnecessaryProperty]
      }
      for (let property of Object.keys(net)) {
        if (newNetsProperties[property]) {
          newNetsProperties[property][net[property]] = config[property].filter(variant => variant.id == net[property])[0][property]
        } else {
          newNetsProperties[property] = {}
          newNetsProperties[property][net[property]] = config[property].filter(variant => variant.id == net[property])[0][property]
        }
      }
    }
    return newNetsProperties
  }

  let getData = async () => {
    let nets = await fetch(`${apiUrl}/cells/${netType}/${cellId}`)
    nets = await nets.json()
    setNets(nets)

    let config = await fetch(`${apiUrl}/config/${netType}`)
    config = await config.json()
    setNetsProperties(getNetsProperties(JSON.parse(JSON.stringify(nets)), config))
  }

  useEffect(() => {
    getData()
  }, [])

  let [images, setImages] = useState(null)

  return (
    <>
      <Header/>
      {!(nets && netsProperties) ? <Loader/> :
        <section className={styles.Card}>
          <Slider className={styles.Card__slider} images={images}/>
          <div className={styles.Card__description}>
            <h1>Сетка садовая {netType == 'plastic' ? 'пластиковая' : 'безузелковая'} {cell} мм</h1>
            <CardProperties nets={nets} netsProperties={netsProperties} setImages={setImages}/>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias alias veniam labore, sapiente totam ipsum? Eum vero laborum adipisci unde, doloribus natus enim, voluptatibus alias facilis modi fuga laudantium nostrum, doloremque ipsa officiis similique fugiat. Doloremque sequi sit animi eaque asperiores? Hic iure sunt inventore harum error quod quasi dolore?</p>
          </div>
        </section>}
    </>
  )
}
