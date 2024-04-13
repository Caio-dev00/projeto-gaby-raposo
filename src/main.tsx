import React from 'react'
import ReactDOM from 'react-dom/client'
import { router } from './App'
import './index.css'

import AuthProvider from './contexts/AuthContext'
import { CartProvider } from './contexts/cartContext'

import { RouterProvider } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
   <AuthProvider>
     <CartProvider>
      <RouterProvider router={router} />
     </CartProvider>
   </AuthProvider>
  </React.StrictMode>
)
