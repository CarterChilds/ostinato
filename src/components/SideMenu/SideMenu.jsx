import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import './SideMenu.scss'

function SideMenu(props) {
    let profilePic = {
        backgroundImage: `url(${props.profilePic})`
    }
    return (
        <div className={props.display ? 'side-menu slide-in' : 'side-menu'}>
            <span>{props.username}</span>
            <div className='profile-pic'
                style={profilePic}
            >
                {/* <img src={props.profilePic} alt='' /> */}
            </div>
            <Link to='/' onClick={() => props.toggleFn('showSideMenu')}>
                <h3>Home</h3>
            </Link>
            <Link to='/dashboard' onClick={() => props.toggleFn('showSideMenu')}>
                <h3>My Dashboard</h3>
            </Link>
            {/* eslint-disable-next-line */}
            <a onClick={() => {
                props.toggleFn('showSideMenu')
                props.newLoopFn()
            }}>
                <h3>New Loop</h3>
            </a>
            <Link to='/account' onClick={() => props.toggleFn('showSideMenu')}>
                <h3>Account Settings</h3>
            </Link>
            <Link to='/' onClick={() => {
                props.logoutFn()
                props.toggleFn('showSideMenu')
            }}>
                <h3>Logout</h3>
            </Link>

        </div>
    )
}

function mapStateToProps(store) {
    const { username, profilePic } = store
    return { username, profilePic }
}

export default connect(mapStateToProps)(SideMenu)