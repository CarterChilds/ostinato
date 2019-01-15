import React, { Component } from 'react'
import SequenceRow from '../SequenceRow/SequenceRow'
import KeySelector from '../KeySelector/KeySelector'
import Transporter from '../Transporter/Transporter'
import TempoSelector from '../TempoSelector/TempoSelector'
import './LoopEditor.css'
import Tone from 'tone'

// create the synth
let noteEngines = []
for (let i=0; i < 8; i++) {
    noteEngines.push(new Tone.Synth({
        oscillator: {
            type: 'square'
        },
        envelope: {
            attack: 0.005,
            decay: 0.1,
            sustain: 0.3,
            release: 1
        }
    }))
}

// create effects
const filter = new Tone.Filter({
    type: 'lowpass',
    frequency: 280,
    roloff: -24,
    Q: 1,
    gain: 0
})
const delay = new Tone.PingPongDelay(0.75, 0.7)
delay.wet.value = 0.5;
delay.toMaster()

// attach effects to the synth
noteEngines.forEach(synth => {
    synth.connect(filter).connect(delay).toMaster()
})



export default class LoopEditor extends Component {
    constructor(props) {
        super(props)
        this.state = {
            title: 'New Loop',
            tempo: 120,
            key: 'c',
            playPause: false,
            rowData: [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]],
            noteIDs: [[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null]],
            scale: ['C4', 'B3', 'A3', 'G3', 'F3', 'E3', 'D3', 'C3'], 
            activeStep: null,
            repeatId: null

        }
        this.toggleNote = this.toggleNote.bind(this)
        this.playPause = this.playPause.bind(this)
    }

    // KEY CHANGE FUNCTIONALITY!!!!! This is not finished, but I have started the logic. ***********************************
    // calculateScale() {
    //     const sharpScaleDegrees = ['a', 'a#', 'b', 'c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#']
    //     const flatScaleDegrees = ['a', 'bb', 'b', 'c', 'db', 'd', 'eb', 'e', 'f', 'gb', 'g', 'ab']
    //     let newScale = []
    //     const {key} = this.state
    //     keyArr = key.split('')
    //     if (keyArr.length === 1 && keyArr[0].toLowerCase() !== 'f') {

    //     }
    // }

    componentDidMount() {
        this.initializeSoundEngine()
        this.state.rowData.forEach((row, rowIndex) => {
            row.forEach((note, noteIndex) => {
                if (note === 1) {
                    Tone.Transport.schedule(() => noteEngines[rowIndex].triggerAttackRelease(this.state.scale[rowIndex], '16n'), `0:0:${noteIndex%16}`)
                }
            })
        })
    }

    componentWillUnmount() {
        Tone.Transport.clear(this.state.repeatId)
        Tone.Transport.stop()
        // this.rowData.map((step, i) => {
        //     if (this.state[i].id) {
        //         Tone.Transport.clear(this.state[i].id)
        //     }
        // })
        this.setState({repeatId: null})
    }

    initializeSoundEngine() {
        const repeatId = Tone.Transport.scheduleRepeat(() => {
            if (Number.isInteger(this.state.activeStep) && this.state.activeStep !== 15) {
                this.setState({activeStep: this.state.activeStep + 1})
            } else {
                this.setState({activeStep: 0})
            }
        }, '16n')
        Tone.Transport.loop = true;
        Tone.Transport.loopStart = '0'
        Tone.Transport.loopEnd = '1m'
        Tone.Transport.loopLength = 1;
        this.setState({activeStep: -1, repeatId})
        Tone.Transport.start()
    }

    addNote(rowIndex, noteIndex) {
        const noteID = Tone.Transport.schedule(() => noteEngines[rowIndex].triggerAttackRelease(this.state.scale[rowIndex], '16n'), `0:0:${noteIndex%16}`)
        let idArr = [...this.state.noteIDs]
        idArr[rowIndex][noteIndex] = noteID
        this.setState({
            noteIDs: idArr
        })
    }

    removeNote(rowIndex, noteIndex) {
        Tone.Transport.clear(this.state.noteIDs[rowIndex][noteIndex])
    }

    handleChange(prop, evt) {
        this.setState({
            [prop]: evt.target.value
        })
    }

    toggleNote(rowIndex, noteIndex) {
        let newArr = this.state.rowData.slice()
        if (newArr[rowIndex][noteIndex] === 0) {
            newArr[rowIndex][noteIndex] = 1
            this.addNote(rowIndex, noteIndex)
        } else {
            newArr[rowIndex][noteIndex] = 0
            this.removeNote(rowIndex, noteIndex)
        }
        this.setState({
            rowData: newArr
        })
    }

    playPause() {
        if (Tone.context.state !== 'running') {
            Tone.context.resume()
            Tone.Transport.toggle()
        } else {
            Tone.context.suspend()
            Tone.Transport.toggle()
        }
    }

    render() {
        return (
            <div>
                <div className='loop-title-bar'>
                    <input
                        type='text'
                        value={this.state.title}
                        onChange={e => this.handleChange('title', e)}
                    />
                    <button>Save</button>
                    <button>Delete</button>
                </div>
                <div className='sequencer'>
                    {this.state.rowData.map((row, index) => (
                        <SequenceRow
                            key={index}
                            rowIndex={index}
                            data={this.state.rowData[index]}
                            note={this.state.scale[index]}
                            changeFn={this.toggleNote}
                        />
                    ))}
                </div>
                <div className='loop-settings-bar'>
                    <Transporter 
                        playFn={this.playPause}
                    />
                </div>
            </div>
        )
    }
}