import React, {Component} from 'react'
import Banner from '../Banner/Banner'
import Featured from '../Featured/Featured'
import Login from '../Login/Login'
import Register from '../Register/Register'

export default class Home extends Component {
    constructor(props){ 
        super(props)
        this.state = {

        }
    }

    render() {
        return (
            <div>
                <h1>
                    Home
                </h1>
                <Banner />
                <Featured />
                <Login />
                <Register />
            </div>
        )
    }
}