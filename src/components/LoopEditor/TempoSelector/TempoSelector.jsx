import React from 'react'
import './TempoSelector.scss'

export default function TempoSelector(props) {
    return (
        <div className='slider'>
            <input 
                type='range'
                id='tempo-slider'
                name='tempo'
                min='12'
                max='300'
                value={props.tempo}
                step='4'
                onChange={e => props.changeFn(e)}
            />
        </div>
    )
}