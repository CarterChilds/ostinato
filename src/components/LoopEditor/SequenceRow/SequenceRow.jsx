import React from 'react'
import './SequenceRow.scss'

export default function SequenceRow(props) {
    return (
        <div>
            {props.data.map((note, noteIndex) => (
                <div
                    className={note === 1 ? 'selected note' : 'note'}
                    id={(props.activeNote) === noteIndex ? 'active-row' : ''}
                    key={noteIndex}
                    onClick={() => {
                        props.sendFn(props.rowIndex, noteIndex)
                        }}
                />
            ))}
        </div>
    )
}