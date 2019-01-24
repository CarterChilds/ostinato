import React, { Component } from 'react'
import './Header.scss'
import logo from '../../img/logov3.svg'
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { getUser } from '../../ducks/reducer'
import Login from './Login/Login'
import Register from './Register/Register'
import SideMenu from '../SideMenu/SideMenu'
import axios from 'axios';

class Header extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showLogo: true,
            showLogin: false,
            showRegister: false,
            showSideMenu: false,
            loggedIn: false
        }
        this.toggle = this.toggle.bind(this)
        this.logout = this.logout.bind(this)
        this.newLoop = this.newLoop.bind(this)
    }

    async componentDidMount() {
        await this.checkLoginStatus()
    }

    async checkLoginStatus() {
        try {
            const loginData = await axios.get('/auth/me')
            this.props.getUser(loginData.data)
        } catch (e) {
            console.log(e)
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.showSideMenu !== this.state.showSideMenu) {
            this.setState({
                showSideMenu: this.state.showSideMenu
            })
        }
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

    newLoop() {
        // const { id: user_id } = this.props
        // console.log(user_id)
        axios.post('/api/loop')
            .then(res => {
                this.props.history.push(`/loop/${res.data.loop_id}`)
            })
    }

    render() {
        return (
            <div className='header'>
                <Link
                    onClick={() => this.setState({ showSideMenu: false })}
                    to='/'
                >
                    <div
                        className="logo"
                        id={this.state.showLogo ? '' : 'hide-logo'}
                    >
                        {/* <h1>{`OSTINATO`}</h1> */}
                        <img src={logo} alt='logo' />
                    </div>
                </Link>

                {this.state.loggedIn === false ? (
                    <div className='nav'>
                        <div
                            className="header-button"
                            onClick={() => {
                                this.toggle('showRegister')
                                // this.navigateHome()
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
                                // this.navigateHome()
                            }}
                        >
                            <h3>
                                Login
                            </h3>
                        </div>
                        <i
                            className='fas fa-bars fa-2x'
                            onClick={() => {
                                this.toggle('showLogin')
                            }}
                        />
                    </div>
                ) : (
                        <div className='nav'>
                            <div
                                className="header-button"
                                onClick={() => {
                                    this.toggle('showSideMenu')
                                }}
                            >
                                <h3>
                                    Menu
                                </h3>
                            </div>
                            <i
                                className='fas fa-bars fa-2x'
                                onClick={() => {
                                    this.toggle('showSideMenu')
                                }}
                            />
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
                <SideMenu
                    display={this.state.showSideMenu}
                    toggleFn={this.toggle}
                    logoutFn={this.logout}
                    newLoopFn={this.newLoop}
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