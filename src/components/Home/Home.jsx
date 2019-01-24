import React, {Component} from 'react'
import Banner from '../Banner/Banner'
import Features from '../Features/Features'

export default class Home extends Component {
    constructor(props){ 
        super(props)
        this.state = {

        }
    }

    render() {
        return (
            <div>
                <Banner />
                <Features />
            </div>
        )
    }
}