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
import './App.scss'

function App() {

  return (
    <StyledEngineProvider injectFirst>
      <BrowserRouter> 
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
      </BrowserRouter>
    </StyledEngineProvider>
  )
}

export default App
