import { useState } from 'react'
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import AppRouter from '../router/AppRouter'
import Header from './components/header/Header'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='container-body'>
      <Header />
      <AppRouter />
    </div>

  )
}

export default App
