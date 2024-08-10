import React, { useEffect, useState } from 'react'
import styles from './Recommendations.module.scss'
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';
import {Slide, Card, CardActionArea, CardMedia, CardContent} from '@mui/material';
import noImage from './noImage.png'

export const Recommendations = () => {
  let [isOpen, setIsOpen] = useState(false)
  let [recommendations, setRecommendations] = useState()
  let apiUrl = import.meta.env.VITE_APIURL
  let netType = 'plastic'

  let getRecommendations = async () => {
    let response = await fetch(`${apiUrl}/nets/${netType}`)
    response = await response.json()
    setRecommendations(response.slice(0, 2))
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
              <CardActionArea sx={{width: '100%', height: '100%'}}>
                <img src={card.images[0] ? card.images[0] : noImage}
                className={styles.Recommendations__cardImage}/>
                <CardContent>
                  <p>{card.cell}</p>
                </CardContent>
              </CardActionArea>
            </Card>) 
          : null}
        </div>
        <IconButton className={styles.Recommendations__close} onClick={() => setIsOpen(false)}><CloseIcon/></IconButton>
      </div>
    </Slide>
  )
}
