import React, { useState, useRef } from 'react'
import styles from './AddToBasket.module.scss'
import { Button } from '@mui/material'

export const AddToBasket = ({errorProviso = false, onSuccess = () => {}}) => {
  let [basketButtonValue, setBasketButtonValue] = useState('добавить в корзину') 
  let [basketButtonColor, setBasketButtonColor] = useState('primary')
  let elementToBasketRef = useRef()
  let [toBasket, setToBasket] = useState(false)
  let animationDuration = 1000
  let [isDisabled, setIsDisabled] = useState(false)

  let getBasketAnimationСoordinates = () => {
    let basket = document.querySelector('#basket')
    let x = basket.offsetLeft - elementToBasketRef.current.offsetLeft
    let y = basket.offsetTop - elementToBasketRef.current.offsetTop
    return [x, y]
  }

  let basketButtonError = () => {
    setBasketButtonColor('error')
    setBasketButtonValue('выберите свойства')
    setTimeout(() => {
      setBasketButtonColor('primary')
      setBasketButtonValue('добавить в корзину')
    }, 2000)
  }

  let basketSuccessButton = () => {
    // setBasketButtonColor('success') из-за disabled атрибута цвета кнопки не меняются :(
    setBasketButtonValue('в корзине')
    setTimeout(() => {
      // setBasketButtonColor('primary')
      setBasketButtonValue('добавить в корзину')
      setIsDisabled(false)
    }, 2000)
  }

  return (
    <div style={{width: 'fit-content'}} >
      <Button disabled={isDisabled} color={basketButtonColor} onClick={() => {
        if (errorProviso) {
          basketButtonError()
        } else {
          setIsDisabled(true)
          onSuccess()
          // ----------animation---------------
          setToBasket(true)
          setTimeout(() => {
            setToBasket(false)
            basketSuccessButton() // меняем цвет и текст кнопки
          }, animationDuration)
        }
      }} className={styles.AddToBasket__basketButton} variant='outlined'>{basketButtonValue}</Button>
      <div ref={elementToBasketRef} style={toBasket ? {
        opacity: 0.5,
        transition: `all ${animationDuration}ms ease-in-out`,
        transform: `translate(${getBasketAnimationСoordinates()[0]}px, ${getBasketAnimationСoordinates()[1]}px)`
      } : null} className={styles.AddToBasket__element}></div>
    </div>
  )
}
