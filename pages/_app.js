// eslint-disable-next-line import/order
import { Slide, ToastContainer } from 'react-toastify'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'react-toastify/dist/ReactToastify.css'
import 'react-responsive-select/dist/ReactResponsiveSelect.css'
import '../styles/style.scss'
import '../public/dist/pq-fonts/css/ping_ponq_fonts.css'
import '../public/dist/themify-icons/themify-icons.css'
import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'

import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import React from 'react'

const App = ({ Component, pageProps }) => (
  <>
    <Component {...pageProps} />
    <ToastContainer
      autoClose={3000}
      draggable={false}
      transition={Slide}
      closeButton={false}
      hideProgressBar
      position="top-center"
      toastClassName="toast-notification"
    />
  </>
)

export default App
