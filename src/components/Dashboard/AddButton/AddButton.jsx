import React from 'react'
import './AddButton.scss'

export default function AddButton(props) {
    return (
        <div className='add-container'>
            <i 
                className="fas fa-plus-circle fa-2x" 
                onClick={() => props.newLoopFn()}
            />
        </div>
    )
}