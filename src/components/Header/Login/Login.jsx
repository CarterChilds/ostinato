import React, { Component } from 'react'
import '../modals.scss'
import axios from 'axios'
import {withRouter} from 'react-router-dom'
import {getUser} from '../../../ducks/reducer'
import {connect} from 'react-redux'
import Swal from 'sweetalert2'

class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: '',
            password: ''
        }
    }

    handleChange(prop, evt) {
        this.setState({
            [prop]: evt.target.value
        })
    }
    handleKeyDown = evt => {
        if (evt.keyCode === 13) {           //This allows you to press Enter to add the new team. // The key code for enter is 13.
          this.login();
        }
      }

    async login() {
        const {email, password} = this.state
        const res = await axios.post('/auth/login', {email, password})
        if (res.data.loggedIn) {
            this.props.getUser(res.data.userData)
            this.props.toggleFn('showLogin')
            this.props.history.push('/dashboard')
            this.setState({
                email: '',
                password: ''
            })
        } else {
            Swal({
                customClass: 'swal-custom',
                customContainerClass: 'swal-container',
                type: 'error',
                title: 'Uh oh...',
                text: res.data.message,
                confirmButtonColor: 'rgb(44, 255, 96)',
                confirmButtonText: 'Try again',
                backdrop: `
                linear-gradient(69deg, rgba(45, 255, 241, .3), rgba(225, 255, 45, .3))
                `
            })
        }
    }

    render() {
        return (
            <div
                className={this.props.display ? 'modal-background display' : 'modal-background'}
            >
                <div className="background-cover"></div>
                <div className='login-modal'>
                    <div 
                        className="close"
                        onClick={() => this.props.toggleFn('showLogin')}
                    >
                        <div></div>
                        <div></div>
                    </div>
                    <span>Login</span>
                    <div>
                        <p>Email:</p>
                        <input
                            type="text"
                            value={this.state.email}
                            onChange={e => this.handleChange('email', e)}
                            onKeyDown={e => this.handleKeyDown(e)}
                        />
                        <p>Password:</p>
                        <input
                            type="password"
                            value={this.state.password}
                            onChange={e => this.handleChange('password', e)}
                            onKeyDown={e => this.handleKeyDown(e)}
                        />
                    </div>
                    <p>Need an account?</p>
                    <p
                        onClick={() => {
                            this.props.toggleFn('showRegister')
                            this.props.toggleFn('showLogin')
                        }}
                    >Register</p>
                    <div 
                        className='button'
                        onClick={() => this.login()}
                    >Login</div>
                </div>
            </div>
        )
    }
}

export default connect(null, {getUser})(withRouter(Login))