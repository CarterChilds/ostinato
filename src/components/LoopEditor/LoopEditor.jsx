import React, { Component } from 'react'
import './LoopEditor.css'
import Tone from 'tone'
import axios from 'axios';

import SequenceRow from './SequenceRow/SequenceRow'
// import KeySelector from './KeySelector/KeySelector'
import Transporter from './Transporter/Transporter'
import TempoSelector from './TempoSelector/TempoSelector'
import VolumeSlider from './VolumeSlider/VolumeSlider';

// SETUP FOR TONEJS ****************************************
// create the synth
let noteEngines = []
for (let i = 0; i < 8; i++) {
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
var masterVolume = new Tone.Volume(-10);
noteEngines.forEach(instrument => {
    instrument.chain(masterVolume, Tone.Master);
})
const gain = new Tone.Gain(0.3)

const filter = new Tone.Filter({
    type: 'lowpass',
    frequency: 280,
    roloff: -24,
    Q: 1,
    gain: 0
})

const delay = new Tone.PingPongDelay(0.75, 0.7)
delay.wet.value = 0.5;
// delay.toMaster()  // I will attach this functionality to a button down below later

// attach effects to the synth
noteEngines.forEach(synth => {
    synth.connect(filter).connect(delay).connect(gain)
})

// END TONE.JS SETUP ***************************************

export default class LoopEditor extends Component {
    constructor(props) {
        super(props)
        this.state = {
            title: 'New Loop',
            tempo: 120,
            key: 'c',
            rowData: [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]],
            noteIDs: [[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null]],
            scale: ['C4', 'B3', 'A3', 'G3', 'F3', 'E3', 'D3', 'C3'],
            activeNote: null,
            repeatId: null,
            gain: -13
        }
        this.toggleNote = this.toggleNote.bind(this)
        this.playPause = this.playPause.bind(this)
        this.changeTempo = this.changeTempo.bind(this)
        this.changeVolume = this.changeVolume.bind(this)
    }

    async componentDidMount() {
        const { id } = this.props.match.params
        try {
            const loopData = await axios.get(`/api/loop/${id}`)
            const { title, key, tempo, row_1, row_2, row_3, row_4, row_5, row_6, row_7, row_8 } = loopData.data[0]
            const rowArray = [row_1.split(''), row_2.split(''), row_3.split(''), row_4.split(''), row_5.split(''), row_6.split(''), row_7.split(''), row_8.split('')]
            const rowData = rowArray.map(row => {
                return row.map(note => Number(note))
            })
            this.setState({
                rowData, title, key, tempo
            })
        } catch (e) {
            console.log('Loop id does not exist')
        }
        this.initializeSoundEngine()
        this.state.rowData.forEach((row, rowIndex) => {
            row.forEach((note, noteIndex) => {
                if (note === 1) {
                    this.addNote(rowIndex, noteIndex)
                }
            })
        })
    }

    async componentDidUpdate(prevProps, prevState) {
        if (this.props.match.params.id !== prevProps.match.params.id) {
            this.componentWillUnmount()
            this.componentDidMount()
        }
    }

    componentWillUnmount() {
        Tone.Transport.clear(this.state.repeatId)
        Tone.Transport.stop()
        this.state.noteIDs.forEach((row, rowIndex) => {
            row.forEach((note, noteIndex) => {
                if (note) {
                    this.removeNote(rowIndex, noteIndex)
                }
            })
        })
        this.setState({
            repeatId: null,
            rowData: [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]],
            title: 'New Loop',
            tempo: 120,
            key: 'c',
            scale: ['C4', 'B3', 'A3', 'G3', 'F3', 'E3', 'D3', 'C3']
        })
    }

    initializeSoundEngine() {
        const repeatId = Tone.Transport.scheduleRepeat(() => {
            if (Number.isInteger(this.state.activeNote) && this.state.activeNote !== 15) {
                this.setState({ activeNote: this.state.activeNote + 1 })
            } else {
                this.setState({ activeNote: 0 })
            }
        }, '16n')
        Tone.Transport.loop = true;
        Tone.Transport.loopStart = '0'
        Tone.Transport.loopEnd = '1m'
        Tone.Transport.loopLength = 1;
        this.setState({ activeNote: -1, repeatId })
        Tone.Transport.bpm.value = this.state.tempo
        masterVolume.volume.value = this.state.gain
        Tone.Transport.start()
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
    async saveLoop() {
        const { id } = this.props.match.params
        const { title, tempo, key, rowData } = this.state
        const rows = rowData.map(row => (
            row.join('')
        ))
        const res = await axios.put(`/api/loop/${id}`, { title, tempo, key, row_1: rows[0], row_2: rows[1], row_3: rows[2], row_4: rows[3], row_5: rows[4], row_6: rows[5], row_7: rows[6], row_8: rows[7] })
        this.componentWillUnmount()
        await alert(res.data.message)
        this.props.history.push('/dashboard')
    }

    async deleteLoop() {
        const {id} = this.props.match.params
        const res = await axios.delete(`/api/loop/${id}`)
        this.componentWillUnmount()
        await alert (res.data.message)
        this.props.history.push('/dashboard')
    }

    resetLoop() {
        this.componentWillUnmount()
        this.componentDidMount()
    }

    addNote(rowIndex, noteIndex) {
        const noteID = Tone.Transport.schedule(() => noteEngines[rowIndex].triggerAttackRelease(this.state.scale[rowIndex], '16n'), `0:0:${noteIndex % 16}`)
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

    changeTempo(evt) {
        this.setState({
            tempo: evt.target.value
        })
        Tone.Transport.bpm.value = this.state.tempo
    }

    async changeVolume(evt) {
        await this.setState({
            gain: evt.target.value
        })
        masterVolume.volume.value = this.state.gain
        if (this.state.gain <= -20) {
            masterVolume.mute = true
        } else {
            masterVolume.volume.mute = false
        }
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
            this.setState({
                activeNote: 0
            })
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
                    <i
                        className='fas fa-save fa-2x'
                        onClick={() => this.saveLoop()}
                    />
                    <i
                        className='fas fa-trash fa-2x'
                        onClick={() => this.deleteLoop()}
                    />
                    <i
                        className='fas fa-undo fa-2x'
                        onClick={() => this.resetLoop()}
                    />
                </div>
                <div className='sequencer'>
                    {this.state.rowData.map((row, index) => (
                        <SequenceRow
                            key={index}
                            rowIndex={index}
                            data={this.state.rowData[index]}
                            note={this.state.scale[index]}
                            changeFn={this.toggleNote}
                            activeNote={this.state.activeNote}
                        />
                    ))}
                </div>
                <div className='loop-settings-bar'>
                    <div className='volume-info'>
                        <span><span>{Number(this.state.gain) + 20}</span><span>Volume</span></span>
                        <VolumeSlider
                            gain={this.state.gain}
                            changeFn={this.changeVolume}
                        />
                    </div>
                    <Transporter
                        playFn={this.playPause}
                    />
                    <div className='tempo-info'>
                        <span><span>Tempo</span><span>{this.state.tempo}</span></span>
                        <TempoSelector
                            tempo={this.state.tempo}
                            changeFn={this.changeTempo}
                        />
                    </div>
                </div>
            </div>
        )
    }
}