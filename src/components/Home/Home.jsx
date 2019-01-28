import React, { Component } from 'react'
import Banner from '../Banner/Banner'
import Features from '../Features/Features'
import jump from 'jump.js'

export default class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
        this.myRef = null
        this.scroll = this.scroll.bind(this)
    }

    scroll(spot) {
        jump(`#${spot}`, {duration: 1000})
    }

    render() {
        return (
            <div>
                <div id='scroll-top' />
                <Banner
                    scrollFn={this.scroll}
                />
                <div id='features-scroll-target' />
                <Features
                    ref={ref => this.myRef=ref}
                    joinFn='k'
                    scrollFn={this.scroll}
                />
            </div>
        )
    }
}