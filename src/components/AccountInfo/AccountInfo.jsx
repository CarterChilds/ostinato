import React, { Component } from 'react'
import { connect } from 'react-redux'
import './AccountInfo.scss'
import axios from 'axios';
import Swal from 'sweetalert2'

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
            newPass2: '',
            uploadPic: null
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

    changePic = (evt) => {
        if (evt.target.files[0]) {
            this.setState({
                profilePic: URL.createObjectURL(evt.target.files[0]),
                uploadPic: evt.target.files[0]
            })
        } else {
            this.setState({
                profilePic: this.props.profilePic,
                uploadPic: null
            })
        }
    }

    uploadProfilePic = (imgEvt) => {
        // imgEvt.preventDefault()
        const formData = new FormData()
        formData.append('file', this.state.uploadPic)
        axios.post(`/api/profile-pic`, formData, {
            headers: {
                'Content-Type': 'miltipart/form-data'
            }
        }).then(async res => {
            await this.setState({
                profilePic: res.data.location
            })
        }).catch(error => {
            console.log(error)
        })
    }

    async updateAccount() {
        try {
        if (this.state.newPass1 === this.state.newPass2) {
            if (this.state.profilePic !== this.props.profilePic) {
                const formData = new FormData()
                formData.append('file', this.state.uploadPic)
                const upload = await axios.post(`/api/profile-pic`, formData, {
                    headers: {
                        'Content-Type': 'miltipart/form-data'
                    }
                })
                this.setState({profilePic: upload.data.Location})
            }
            const { email, profilePic, username, name, currentPass, newPass1 } = this.state
            const res = await axios.put('/auth/account', { email, profilePic, username, name, currentPass, newPass1 })
            Swal({
                customClass: 'swal-custom',
                customContainerClass: 'swal-container',
                backdrop: `
                    linear-gradient(69deg, rgba(45, 255, 241, .3), rgba(225, 255, 45, .3))
                    `,
                type: 'success',
                title: 'Hooray!',
                text: res.data.message,
                showCloseButton: true,
                confirmButtonText: 'Nice'
            })
        } else {
            Swal({
                customClass: 'swal-custom',
                customContainerClass: 'swal-container',
                backdrop: `
                    linear-gradient(69deg, rgba(45, 255, 241, .3), rgba(225, 255, 45, .3))
                    `,
                type: 'error',
                title: 'Oops...',
                text: `Passwords don't match`,
                showCloseButton: true,
                confirmButtonText: 'Try again'
            })
        }
        } catch (e) {
            Swal({
                customClass: 'swal-custom',
                customContainerClass: 'swal-container',
                backdrop: `
                linear-gradient(69deg, rgba(45, 255, 241, .3), rgba(225, 255, 45, .3))
                `,
                type: 'error',
                title: 'Oops...',
                text: 'Incorrect password',
                showCloseButton: true,
                confirmButtonText: 'Try again'
            })
        }
    }

    render() {
        let profilePic = {
            backgroundImage: `url(${this.state.profilePic})`
        }
        return (
            <div className='account-info'>
                <div className="profile-pic"
                    style={profilePic}
                >
                </div>
                <div>
                    <p>Profile Picture: </p>
                    <input
                        id='profile-pic-uploader'
                        type="file"
                        accept='image/*'
                        // value={this.state.profilePic}
                        onChange={e => this.changePic(e)}
                    />
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
                    <p>Password:<span>*</span> </p>
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