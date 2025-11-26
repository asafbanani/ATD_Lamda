import { useState } from 'react'
import './App.css'
import Login from './screens/Login'
import Signup from './screens/Signup'

function App() {
  const [view, setView] = useState<'login' | 'signup'>('login')

  if (view === 'signup') {
    return <Signup onShowLogin={() => setView('login')} />
  }

  return <Login onShowSignup={() => setView('signup')} />
}

export default App
