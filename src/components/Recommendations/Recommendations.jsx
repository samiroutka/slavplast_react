import React, { useEffect, useState } from 'react'
import styles from './Recommendations.module.scss'
import { useNavigate, useParams } from 'react-router'
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';
import {Slide, Card, CardActionArea, CardMedia, CardContent} from '@mui/material';
import noImage from './noImage.png'

export const Recommendations = ({currentNetId}) => {
  let {netType} = useParams()
  let navigateTo = useNavigate()  
  let [isOpen, setIsOpen] = useState(false)
  let [recommendations, setRecommendations] = useState()
  let apiUrl = import.meta.env.VITE_APIURL

  let getRecommendations = async () => {
    let response = await fetch(`${apiUrl}/nets/${netType}`)
    response = await response.json()
    setRecommendations(response.slice(0, 3).filter(net => net.id != currentNetId))
    setIsOpen(true)
  }

  useEffect(() => {
    getRecommendations()
  }, [])

  return (
    <Slide direction="up" in={isOpen} mountOnEnter unmountOnExit>
      <div className={styles.Recommendations}>
        <h3>Рекомендации</h3>
        <div className={styles.Recommendations__cards}>
          {recommendations ? recommendations.map(card => 
            <Card key={card.id} className={styles.Recommendations__card}>
              <CardActionArea onClick={() => navigateTo(`/nets/${netType}/${card.id}`)} className={styles.Recommendations__cardActionArea}>
                <img src={card.images[0] ? card.images[0] : noImage}
                className={styles.Recommendations__cardImage}/>
                <p>{card.cell}</p>
              </CardActionArea>
            </Card>) 
          : null}
        </div>
        <IconButton className={styles.Recommendations__close} onClick={() => setIsOpen(false)}><CloseIcon/></IconButton>
      </div>
    </Slide>
  )
}
