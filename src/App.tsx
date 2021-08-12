import React from 'react'
import { Route } from 'react-router-dom'
import Menu from './components/Menu'
import BluePage from './pages/BluePage'
import RedPage from './pages/RedPage'
import UsersPage from './pages/UsersPage'

const App = () => {
  return (
    <div>
      <Menu />
      <hr />
      <Route path="/red" component={RedPage} />
      <Route path="/blue" component={BluePage} />
      <Route path="/users" component={UsersPage} />
    </div>
  )
}

export default App
