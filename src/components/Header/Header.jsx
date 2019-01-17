import React, {Component} from 'react'
import './Header.scss'
import { Link, withRouter } from 'react-router-dom'
import Login from './Login/Login'
import Register from './Register/Register'

class Header extends Component{
    constructor(props) {
        super(props)
        this.state = {
            showLogin: false,
            showRegister: false
        }
        this.toggle = this.toggle.bind(this)
    }

    navigateHome() {
        this.props.history.push('/')
    }

    toggle(prop) {
        this.setState({
            [prop]: !this.state[prop]
        })
    }

    render() {
        return (
            <div className='header'>
                <Link to='/'>
                    <div className="logo">
                        <h1>{`OSTINATO`}</h1>
                    </div>
                </Link>
                <div className='nav'>
                    <div
                        className="header-button"
                        onClick={() => {
                            this.toggle('showRegister')
                            this.navigateHome()
                        }}
                    >
                        <h3>
                            Register
                        </h3>
                    </div>
                    <div
                        className="header-button"
                        onClick={() => {
                            this.toggle('showLogin')
                            this.navigateHome()
                        }}
                    >
                        <h3>
                            Login
                        </h3>
                    </div>
                </div>
                <Register
                    display={this.state.showRegister}
                    toggleFn={this.toggle}
                />
                <Login 
                    display={this.state.showLogin}
                    toggleFn={this.toggle}
                />
            </div>
        )
    }
}

export default withRouter(Header)