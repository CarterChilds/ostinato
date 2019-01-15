import React, {Component} from 'react'
import LoopIcon from './LoopIcon/LoopIcon'
import AddButton from './AddButton/AddButton'

export default class Dashboard extends Component {
    constructor(props){ 
        super(props)
        this.state = {

        }
    }

    render() {
        return (
            <div>
                Dashboard
                <LoopIcon />
                <AddButton />
            </div>
        )
    }
}