import React, { Component } from 'react'
import './Features.scss'
import { Parallax } from 'react-parallax'

export default class Features extends Component {
    render() {
        return (
            <div className='features'>
                <Parallax
                    blur={{ min: -5, max: 15 }}
                    bgImage={require('../../img/preview.png')}
                    bgImageAlt=''
                    strength={800}
                >
                    <h1>Create</h1>
                    <h3>A simple interface means anyone can start making music right away!</h3>
                    <div style={{ height: '70vh', width: '100vw' }} />
                </Parallax>
                <Parallax
                    blur={{ min: -5, max: 15 }}
                    bgImage={require('../../img/social-music.jpg')}
                    bgImageAlt=''
                    strength={800}
                >
                    <div className='right'>
                        <h3>Easy sharing makes collaborating with others dead simple.</h3>
                        <h1 id='share'>Share</h1>
                    </div>
                    <div style={{ height: '70vh', width: '100vw', background: 'rgb(154, 255, 245)' }} />
                </Parallax>
                <Parallax
                    strength={800}
                >
                    <h1>Make Music Social Again</h1>
                    <div className='join-button' onClick={() => this.props.scrollFn('scroll-top')}><h3>Click to join now!</h3></div>
                    <div style={{ height: '70vh', width: '100vw', background: 'rgb(45, 255, 181)' }} />
                </Parallax>
            </div>
        )
    }
}