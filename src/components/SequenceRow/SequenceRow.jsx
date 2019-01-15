import React from 'react'
import './SequenceRow.css'

export default function SequenceRow(props) {
    return (
        <div>
            {props.data.map((note, noteIndex) => (
                <div 
                    className={note===1 ? 'active note' : 'note'}
                    key={noteIndex}
                    onClick={() => props.changeFn(props.rowIndex, noteIndex)}
                />
            ))}
        </div>
    )
}