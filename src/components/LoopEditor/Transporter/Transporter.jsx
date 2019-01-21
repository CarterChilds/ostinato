import React from 'react'
import './Transporter.scss'

export default function Transporter(props) {
    return (
        <div
            className='play-button'
            onClick={() => props.playFn()}
        >
            <div className='triangle' />
        </div>
    )
}