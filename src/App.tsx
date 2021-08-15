import React from 'react'
import loadable from '@loadable/component'
import { Route } from 'react-router-dom'
import Menu from './components/Menu'

const BluePage = loadable(() => import('./pages/BluePage'))
const RedPage = loadable(() => import('./pages/RedPage'))
const UsersPage = loadable(() => import('./pages/UsersPage'))

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
