import React, { Component } from 'react'
import './Features.scss'
import { Parallax } from 'react-parallax'

export default class Features extends Component {
    render() {
        return (
            <div className='features'>
                <Parallax
                    blur={{ min: -15, max: 15 }}
                    bgImage={require('../../img/preview.png')}
                    bgImageAlt=''
                    strength={-200}
                >
                    <h1>Create</h1>
                    <h3>A simple interface means anyone can start making music right away!</h3>
                    <div style={{ height: '70vh', width: '100vw' }} />
                </Parallax>
                <Parallax
                    blur={{ min: -15, max: 15 }}
                    bgImage={require('../../img/social-music.jpg')}
                    bgImageAlt=''
                    strength={-200}
                >
                    <div className='right'>
                        <h3>Collaborate with others to make music social again.</h3>
                        <h1 id='share'>Share</h1>
                    </div>
                    <div style={{ height: '70vh', width: '100vw', background: 'rgb(154, 255, 245)' }} />
                </Parallax>
                <Parallax
                    strength={-200}
                >
                    <h1>Make Music Social Again</h1>
                    <div className='join-button'><h3>Click to join now!</h3></div>
                    <div style={{ height: '70vh', width: '100vw', background: 'rgb(45, 255, 181)' }} />
                </Parallax>
            </div>
        )
    }
}