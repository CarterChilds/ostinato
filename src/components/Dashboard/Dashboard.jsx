import React, { Component } from 'react'
import LoopIcon from './LoopIcon/LoopIcon'
import AddButton from './AddButton/AddButton'
import axios from 'axios';
import { connect } from 'react-redux';
import { getUser } from '../../ducks/reducer'
import './Dashboard.scss'

class Dashboard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loops: [],
            sharedLoops: []
        }
        this.newLoop = this.newLoop.bind(this)
    }

    async componentDidMount() {
        try {
            const loginData = await axios.get('/auth/me')
            this.props.getUser(loginData.data)
            this.getUserLoops()
            this.getSharedLoops()
        } catch (e) {
            console.log(e)
            this.props.history.push('/')
        }
    }


    async getUserLoops() {
        const loops = await axios.get(`/api/loops`)
        this.setState({ loops: loops.data })
    }

    async getSharedLoops() {
        const loops = await axios.get('/api/shared')
        this.setState({sharedLoops: loops.data})
    }

    newLoop() {
        // const { id: user_id } = this.props
        // console.log(user_id)
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
                            creator={loop.username}
                            title={loop.title}
                            loopKey={loop.key}
                            tempo={loop.tempo}
                            instrument={loop.instrument}
                            loopID={loop.loop_id}
                        />
                    ))}
                    <AddButton
                        newLoopFn={this.newLoop}
                    />
                </div>
                <h2>SHARED LOOPS</h2>
                <div className='dashboard'>
                    {this.state.sharedLoops.length <= 0 ? 
                        <h3>Sorry, you don't have any shared loops.</h3> : 
                        this.state.sharedLoops.map((loop, i) => (
                        <LoopIcon
                            key={i}
                            creator={loop.username}
                            title={loop.title}
                            loopKey={loop.key}
                            tempo={loop.tempo}
                            instrument={loop.instrument}
                            loopID={loop.loop_id}
                        />
                    ))}
                </div>
            </div>
        )
    }
}

function mapStateToProps(store) {
    const { username } = store;
    return { username }
}

export default connect(mapStateToProps, {getUser})(Dashboard)