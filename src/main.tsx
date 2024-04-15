import React from 'react'
import ReactDOM from 'react-dom/client'
import { router } from './App'
import './index.css'

import AuthProvider from './contexts/AuthContext'
import { CartProvider } from './contexts/cartContext'

import { RouterProvider } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
     <Toaster
      position="top-right"
      reverseOrder={false}
    />
   <AuthProvider>
     <CartProvider>
      <RouterProvider router={router} />
     </CartProvider>
   </AuthProvider>
  </React.StrictMode>
)
