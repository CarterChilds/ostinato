import React, { Component } from 'react'
import './Header.scss'
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { getUser } from '../../ducks/reducer'
import Login from './Login/Login'
import Register from './Register/Register'
import axios from 'axios';

class Header extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showLogin: false,
            showRegister: false,
            loggedIn: false
        }
        this.toggle = this.toggle.bind(this)
    }

    async componentDidMount() {
        await this.checkLoginStatus()
    }

    async checkLoginStatus() {
        try {
            const loginData = await axios.get('/auth/me')
            this.props.getUser(loginData.data)
        } catch(e) {
            console.log(e)
            this.navigateHome()
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.username !== this.props.username) {
            this.setState({
                loggedIn: true
            })
        }
    }

    navigateHome() {
        this.props.history.push('/')
    }

    logout() {
        axios.post('/auth/logout')
            .then(() => {
                this.props.getUser({})
                this.setState({
                    loggedIn: false
                })
            })
    }

    toggle(prop) {
        this.setState({
            [prop]: !this.state[prop]
        })
    }

    render() {
        // console.log(this.props)
        return (
            <div className='header'>
                <Link to='/'>
                    <div className="logo">
                        <h1>{`OSTINATO`}</h1>
                    </div>
                </Link>

                {this.state.loggedIn === false ? (
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
                ) : (
                        <div className='nav'>
                            <div
                                className="header-button"
                                onClick={() => {
                                    this.logout()
                                    this.navigateHome()
                                }}
                            >
                                <h3>
                                    Logout
                            </h3>
                            </div>
                        </div>
                    )}

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

function mapStateToProps(store) {
    const { username, profilePic } = store
    return { username, profilePic }
}

export default connect(mapStateToProps, { getUser })(withRouter(Header))