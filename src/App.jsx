import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import {BrowserRouter, Routes, Route} from 'react-router-dom'

import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Module from './pages/Module'
import ResetPassword from './pages/ResetPassword'
import Resources from './pages/Resources'
import Help from './pages/Help'
import Layout from './pages/Layout' //I think this shouldn't be in pages and should be where App.jsx is (idk?) Same for Header



function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      
        <Routes>
          <Route element = {<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/module" element={<Module />} />
            <Route path="/resources" element={<Resources />}/>
            <Route path="/help" element={<Help />}/>
            <Route path="/" element={<Login />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Route>          
        </Routes> 
    </BrowserRouter>
  );
}

export default App
