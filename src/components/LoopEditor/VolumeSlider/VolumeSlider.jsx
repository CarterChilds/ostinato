import React from 'react'
import './VolumeSlider.css'

export default function VolumeSlider(props) {
    return (
        <div className='slider'>
            <input 
                type='range'
                id='volume-slider'
                name='volume'
                min='-20'
                max='0'
                value={props.gain}
                step='1'
                onChange={e => props.changeFn(e)}
            />
        </div>
    )
}