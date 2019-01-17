import React from 'react'
import './LoopIcon.scss'
import {withRouter} from 'react-router-dom'

function LoopIcon(props) {
    let key = ''
    if (props.loopKey.length < 3 && props.loopKey.charAt(1) !== 'm') {
        key = props.loopKey.charAt(0).toUpperCase() + props.loopKey.slice(1)
    } else {
        key = props.loopKey
    }
    return (
        <div 
            className='icon-container'
            onClick={() => props.history.push(`/loop/${props.loopID}`)}
        
        >
            <div className='loop-icon'>
                <h4>{props.title}</h4>
                <h4>{props.tempo} bpm</h4>
                <h4>Key: {key}</h4>
            </div>
        </div>
    )
}

export default withRouter(LoopIcon)