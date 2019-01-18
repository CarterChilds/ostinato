import React, {Component} from 'react'
import Banner from '../Banner/Banner'
import Featured from '../Featured/Featured'

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
                <Featured />
            </div>
        )
    }
}