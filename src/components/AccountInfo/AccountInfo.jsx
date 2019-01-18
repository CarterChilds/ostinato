import React, { Component } from 'react'
import { connect } from 'react-redux'
import './AccountInfo.scss'
import axios from 'axios';

class AccountInfo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            name: '',
            username: '',
            email: '',
            profilePic: '',
            currentPass: '',
            newPass1: '',
            newPass2: ''
        }
    }

    componentDidMount() {
        const { name, username, email, profilePic } = this.props
        this.setState({
            name, username, email, profilePic
        })
    }

    componentDidUpdate(prevProps) {
        if (prevProps.name !== this.props.name) {
            const { name, username, email, profilePic } = this.props
            this.setState({ name, username, email, profilePic })
        }
    }

    handleChange(prop, evt) {
        this.setState({
            [prop]: evt.target.value
        })
    }

    updateAccount() {
        try{
            if (this.state.newPass1 === this.state.newPass2) {
                const { email, profilePic, username, name, currentPass, newPass1 } = this.state
                axios.put('/auth/account', { email, profilePic, username, name, currentPass, newPass1 })
            } else {
                console.log(`Passwords don't match`)
            }
        } catch(e) {
            alert(e)
        }
    }

    render() {
        return (
            <div className='account-info'>
                <div className="profile-pic">
                    <img src={this.state.profilePic} alt="" />
                </div>
                <div>
                    <p>Update Name: </p>
                    <input
                        type="text"
                        value={this.state.name}
                        onChange={e => this.handleChange('name', e)}
                    />
                </div>
                <div>
                    <p>Change Username: </p>
                    <input
                        type="text"
                        value={this.state.username}
                        onChange={e => this.handleChange('username', e)}
                    />
                </div>
                <div>
                    <p>Change Email: </p>
                    <input
                        type="text"
                        value={this.state.email}
                        onChange={e => this.handleChange('email', e)}
                    />
                </div>
                <div>
                    <p>Profile Picture: </p>
                    <input
                        type="text"
                        value={this.state.profilePic}
                        onChange={e => this.handleChange('profilePic', e)}
                    />
                </div>
                <div>
                    <p>Password: </p>
                    <input
                        type="password"
                        value={this.state.currentPass}
                        onChange={e => this.handleChange('currentPass', e)}
                    />
                </div>
                <div>
                    <p>New Password: </p>
                    <input
                        type="password"
                        value={this.state.newPass1}
                        onChange={e => this.handleChange('newPass1', e)}
                    />
                </div>
                <div>
                    <p>Re-enter New Password: </p>
                    <input
                        type="password"
                        value={this.state.newPass2}
                        onChange={e => this.handleChange('newPass2', e)}
                    />
                </div>
                <div
                    className='button'
                    onClick={() => this.updateAccount()}
                >Update Account</div>
            </div>
        )
    }
}

function mapStateToProps(store) {
    const { name, username, email, profilePic } = store
    return { name, username, email, profilePic }
}

export default connect(mapStateToProps)(AccountInfo)