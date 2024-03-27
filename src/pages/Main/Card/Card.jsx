import React, { useEffect, useState } from 'react'
import styles from './Card.module.scss'
import { useParams, useLocation } from 'react-router';
// -------------------------
import { Header } from '@/components/Header/Header'
import test_img from './images/test_img.jpg'
import { Loader } from '@/components/Loader/Loader.jsx'
import { Slider } from '@/components/Slider/Slider'
import { MenuItem, FormControl } from '@mui/material';
import Select from '@mui/material/Select';

export const Card = () => {
  const MuiSelect = ({property}) => {
    const [option, setOption] = useState(Object.keys(netsProperties[property])[0])
    return (
      <FormControl variant="standard" fullWidth className={styles.Card__muiLabel}>
        <Select
          value={option}
          onChange={(event) => {
            setOption(event.target.value)
            console.log('select changed')
          }}>
          {Object.entries(netsProperties[property]).map(([key, value]) => 
            <MenuItem key={key} value={key}>{value}</MenuItem>
          )}
        </Select>
      </FormControl>
    )
  }

  // ------------------------------------------------------

  let apiUrl = import.meta.env.VITE_APIURL
  let {netType, cellId, cell} = useParams()
  let [nets, setNets] = useState()
  let [netsProperties, setNetsProperties] = useState()

  let getNetsProperties = (nets, config) => {
    let newNetsProperties = {}
    for (let net of nets) {
      delete net['id']
      delete net['images']
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
    setNetsProperties(getNetsProperties(nets, config))
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <>
      <Header/>
      {!(nets && netsProperties) ? <Loader/> :
        <section className={styles.Card}>
          <Slider className={styles.Card__slider} images={[test_img, test_img, test_img]}/>
          <div className={styles.Card__description}>
            <h1>Сетка садовая пластиковая {cell} мм</h1>
            <div className={styles.Card__properties}>
              <div className={styles.Card__property}>
                <strong>Длина</strong>
                <div className={styles.underline}></div>
                <MuiSelect property={'length'}/>
              </div>
              <div className={styles.Card__property}>
                <strong>Ширина</strong>
                <div className={styles.underline}></div>
                <MuiSelect property={'width'}/>
              </div>
              {netsProperties['color'] ? 
                <div className={styles.Card__property}>
                  <strong>Цвет</strong>
                  <div className={styles.underline}></div>
                  <MuiSelect property={'color'}/>
                </div> :
                <div className={styles.Card__property}>
                  <strong>Толщина</strong>
                  <div className={styles.underline}></div>
                  <MuiSelect property={'thickness'}/>
                </div>}
            </div>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias alias veniam labore, sapiente totam ipsum? Eum vero laborum adipisci unde, doloribus natus enim, voluptatibus alias facilis modi fuga laudantium nostrum, doloremque ipsa officiis similique fugiat. Doloremque sequi sit animi eaque asperiores? Hic iure sunt inventore harum error quod quasi dolore?</p>
          </div>
        </section>}
    </>
  )
}
