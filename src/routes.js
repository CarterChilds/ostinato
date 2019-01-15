import React from 'react'
import Home from './components/Home/Home'
import Dashboard from './components/Dashboard/Dashboard'
import AccountInfo from './components/AccountInfo/AccountInfo'
import LoopEditor from './components/LoopEditor/LoopEditor'

import {Switch, Route} from 'react-router-dom'

export default (
    <Switch>
        <Route exact path='/' component={Home} />
        <Route path='/dashboard' component={Dashboard} />
        <Route path='/account' component={AccountInfo} />
        <Route path='/loop/:id' component={LoopEditor} />
    </Switch>
)