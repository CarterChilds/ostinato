import React from 'react'
import './Banner.scss'
import SequenceRow from '../LoopEditor/SequenceRow/SequenceRow'

export default function Banner(props) {
    const data=[[0,0,0,0,0,0,0,0,1,0,0,0], [0,0,0,0,0,0,0,0,0,1,1,0], [0,0,0,0,0,0,1,1,0,0,0,0], [0,0,0,0,1,0,0,0,0,0,0,0], [1,0,1,0,0,0,0,0,0,0,0,0]]
    return (
        <div className='banner'>
        {data.map((row, i) => (
            <SequenceRow 
                key={i}
                data={data[i]}
                changeFn={() => console.log('work it!')}
            />
        ))}
        <div className="main-overlay">
            <h2>Loop</h2>
        </div>
        </div>
    )
}