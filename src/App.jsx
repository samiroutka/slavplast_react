// import { useState } from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import { StyledEngineProvider } from '@mui/material/styles';
// ------------------------
import { MainMain } from '@/pages/Main/MainMain/MainMain.jsx'
// import { Product } from '@/pages/Product/Product.jsx'
import { Sorting } from '@/pages/Main/Sorting/Sorting.jsx'
import { Card } from '@/pages/Main/Card/Card.jsx';
import { Basket } from '@/pages/Main/Basket/Basket.jsx';
import { AdminMain } from '@/pages/Admin/AdminMain/AdminMain.jsx'
import { AdminCard } from '@/pages/Admin/AdminCard/AdminCard.jsx'
import { AdminConfig } from '@/pages/Admin/AdminConfig/AdminConfig.jsx'
import { AdminPassword } from '@/pages/Admin/AdminPassword/AdminPassword.jsx'
import { useEffect, useState } from 'react';
import { context } from '@/context.js'
import './App.scss'

function App() {
  let [basket, setBasket] = useState(getCookie()['basket'] ? JSON.parse(getCookie()['basket']) : [])

  function getCookie() {
    return document.cookie.split('; ').reduce((acc, item) => {
      const [name, value] = item.split('=')
      acc[name] = value
      return acc
    }, {})
  }

  useEffect(() => {
    console.log(document.cookie)
    document.cookie = 'basket=; Max-Age=-1;';
  })

  useEffect(() => {
    if (basket.length != 0) {
      document.cookie=`basket=${JSON.stringify(basket)}`
    }
  }, [basket])

  return (
    <StyledEngineProvider injectFirst>
      <BrowserRouter> 
        <context.Provider value={{basket, setBasket}}>
          <Routes>
            <Route path="/admin/password" element={<AdminPassword/>}/>
            <Route path="/admin/:netType" element={<AdminMain/>}/>
            <Route path="/admin/:netType" element={<AdminMain/>}/>
            <Route path="/admin/:netType/config" element={<AdminConfig/>}/>
            <Route path="/admin/:netType/config" element={<AdminConfig/>}/>
            <Route path="/admin/:netType/card/add" element={<AdminCard/>}/>
            <Route path="/admin/:netType/card/:id" element={<AdminCard/>}/>
            {/* --------------------------------------------------------------- */}
            <Route path="/" element={<MainMain/>}/>
            <Route path="/Sorting/:netType" element={<Sorting/>}/>
            <Route path="/cards/:netType/:cellId/:cell" element={<Card/>}/>
            <Route path="/basket" element={<Basket/>}/>
          </Routes>
        </context.Provider>
      </BrowserRouter>
    </StyledEngineProvider>
  )
}

export default App
