// import { useState } from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import { Main } from '@/pages/Main/Main.jsx'
// import { Product } from '@/pages/Product/Product.jsx'
import { Sorting } from '@/pages/Sorting/Sorting'
import { Card } from '@/pages/Card/Card.jsx'
import { Basket } from '@/pages/Basket/Basket.jsx'
import { Admin } from './pages/Admin/Admin.jsx'
import { AdminCard } from './pages/AdminCard/AdminCard.jsx'
import { StyledEngineProvider } from '@mui/material/styles';
import { AdminConfig } from './pages/AdminConfig/AdminConfig.jsx'
import './App.scss'

function App() {

  return (
    <StyledEngineProvider injectFirst>
      <BrowserRouter> 
        <Routes>
          <Route path="/admin/config" element={<AdminConfig/>}/>
          <Route path="/admin/card/add" element={<AdminCard/>}/>
          <Route path="/admin/card/:id" element={<AdminCard/>}/>
          <Route path="/admin" element={<Admin/>}/>
          <Route path="/" element={<Main/>}/>
          <Route path="/Sorting/:type" element={<Sorting/>}/>
          {/* <Route path="/product/:type" element={<Product/>}/> */}
          <Route path="/cards/:card" element={<Card/>}/>
          <Route path="/basket" element={<Basket/>}/>
        </Routes>
      </BrowserRouter>
    </StyledEngineProvider>
  )
}

export default App
