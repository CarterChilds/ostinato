import React, { Component } from 'react'
import LoopIcon from './LoopIcon/LoopIcon'
import AddButton from './AddButton/AddButton'
import axios from 'axios';
import { connect } from 'react-redux';
import './Dashboard.scss'

class Dashboard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loops: []
        }
        this.newLoop = this.newLoop.bind(this)
    }

    async componentDidMount() {
            await this.getUserLoops()
    }

    async getUserLoops() {
        const loops = await axios.get(`/api/loops`)
        this.setState({ loops: loops.data })
    }

    newLoop() {
        const {id:user_id} = this.props
        console.log(user_id)
        axios.post('/api/loop')
            .then(res => {
                this.props.history.push(`/loop/${res.data.loop_id}`)
            })
    }

    render() {
        return (
            <div>
                <h2>{this.props.username.toUpperCase()}'S LOOPS</h2>
                <div className='dashboard'>
                    {this.state.loops.map((loop, i) => (
                        <LoopIcon
                            key={i}
                            title={loop.title}
                            loopKey={loop.key}
                            tempo={loop.tempo}
                            loopID={loop.loop_id}
                        />
                    ))}
                    <AddButton
                        newLoopFn={this.newLoop}
                    />
                </div>
            </div>
        )
    }
}

function mapStateToProps(store) {
    const { username } = store;
    return { username }
}

export default connect(mapStateToProps)(Dashboard)