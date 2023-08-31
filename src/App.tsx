import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ReactElement, Suspense, useEffect } from 'react'

import Canvas from './Components/Canvas';
import CircularProgress from '@mui/material/CircularProgress';
import Home from './Routes/Home'
import NavBar from './Components/NavBar'
import SignIn from './Routes/SignIn'
import { lazyLoad } from './Utility/lazyLoad'
import socket from './Components/Websocket/socket';
import { useGetAuthQuery } from './Store/RTK/authSlice'

const AboutPage = lazyLoad('../Routes/About')

const About = () => {
  return (
    <Suspense fallback={<h2>Loading...</h2>}>
      <AboutPage/>
    </Suspense>
  )
}

const App = ():ReactElement => {
  const { isLoading, data } = useGetAuthQuery()
  const isLoggedIn = data
  
  useEffect(() => {
    console.log('connecting')
    socket.emit('send message')
  }, [])
  
  if(isLoading) return <CircularProgress/>
  
  return(
    <>
    {isLoggedIn ? (
        <BrowserRouter>
          <NavBar/>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/draw" element={<Canvas />} />
            <Route path="*" element={<Navigate to='/' replace={true}/>} />
          </Routes>
        </BrowserRouter>
    ) : (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="*" element={<Navigate to='/' replace={true}/>} />
        </Routes>
      </BrowserRouter>
    )}
  </>
  )
}

export default App