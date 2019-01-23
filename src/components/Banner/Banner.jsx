import React from 'react'
import './Banner.scss'
import logo from '../../img/logov2.svg'

export default function Banner(props) {
    return (
        <div className='banner'>
            <div className='banner-content'>
                <div id='logo-container'>
                    <img src={logo} alt="" />
                    <h1>Social Beatmaker</h1>
                </div>
                <div className="button-wrapper">
                    <svg height='60' width='320' xmlns='http://www.w3.org/2000/svg'>
                        <rect className='shape' height='60' width='220' />
                    </svg>
                    <div className="button-text">EXPLORE</div>
                </div>
            </div>
        </div>
    )
}