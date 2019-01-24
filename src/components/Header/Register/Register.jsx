import React, { Component } from 'react'
import '../modals.scss'
import axios from 'axios'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { getUser } from '../../../ducks/reducer'

class Register extends Component {
    constructor(props) {
        super(props)
        this.state = {
            name: '',
            email: '',
            username: '',
            password1: '',
            password2: ''
        }
    }

    handleChange(prop, evt) {
        this.setState({
            [prop]: evt.target.value
        })
    }

    handleKeyDown = evt => {
        if (evt.keyCode === 13) {                //This allows you to press Enter to add the new team. // The key code for enter is 13.
            this.register();
        }
    }

    async register() {
        if (this.state.password1 === this.state.password2 && this.state.password1.length > 0) {
            try {
                const { name, email, username, password1: password } = this.state
                const res = await axios.post('/auth/register', { name, email, username, password })
                if (res.data.loggedIn) {
                    this.props.getUser(res.data.userData)
                    this.props.toggleFn('showRegister')
                    this.props.history.push('/dashboard')
                    this.setState({
                        name: '',
                        email: '',
                        username: '',
                        password1: '',
                        password2: ''
                    })
                }
            } catch (e) {
                console.log(e)
            }
        } else if (this.state.password1 !== this.state.password2) {
            console.log(`Passwords don't match!`)
        } else if (this.state.password1.length === 0) {
            console.log('Please enter a password')
        }
    }

    render() {
        return (
            <div
                className={this.props.display ? 'modal-background display' : 'modal-background'}
            >
                <div className='register-modal'>
                    <div
                        className="close"
                        onClick={() => this.props.toggleFn('showRegister')}
                    >
                        <div></div>
                        <div></div>
                    </div>
                    <span>Register</span>
                    <div>
                        <p>First Name:</p>
                        <input
                            type="text"
                            value={this.state.name}
                            onChange={e => this.handleChange('name', e)}
                            onKeyDown={e => this.handleKeyDown(e)}
                        />
                        <p>Email:</p>
                        <input
                            type="email"
                            value={this.state.email}
                            onChange={e => this.handleChange('email', e)}
                            onKeyDown={e => this.handleKeyDown(e)}
                        />
                        <p>Username:</p>
                        <input
                            type="text"
                            value={this.state.username}
                            onChange={e => this.handleChange('username', e)}
                            onKeyDown={e => this.handleKeyDown(e)}
                        />
                        <p>Password:</p>
                        <input
                            type="password"
                            value={this.state.password1}
                            onChange={e => this.handleChange('password1', e)}
                            onKeyDown={e => this.handleKeyDown(e)}
                        />
                        <p>Re-type Password:</p>
                        <input
                            type="password"
                            value={this.state.password2}
                            onChange={e => this.handleChange('password2', e)}
                            onKeyDown={e => this.handleKeyDown(e)}
                        />
                    </div>
                    <p>Already have an account?</p>
                    <p
                        onClick={() => {
                            this.props.toggleFn('showRegister')
                            this.props.toggleFn('showLogin')
                        }}
                    >Login</p>
                    <div
                        className='button'
                        onClick={() => this.register()}
                    >Register</div>
                </div>
            </div>
        )
    }
}

export default connect(null, { getUser })(withRouter(Register))