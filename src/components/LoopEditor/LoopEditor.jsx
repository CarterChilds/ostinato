import React, { Component } from 'react'
import './LoopEditor.scss'
import Tone from 'tone'
import Swal from 'sweetalert2'
import io from 'socket.io-client'
import axios from 'axios';
import { connect } from 'react-redux'
import { getUser } from '../../ducks/reducer'

import SequenceRow from './SequenceRow/SequenceRow'
// import KeySelector from './KeySelector/KeySelector'
import Transporter from './Transporter/Transporter'
import TempoSelector from './TempoSelector/TempoSelector'
import VolumeSlider from './VolumeSlider/VolumeSlider'
import SoundSelector from './SoundSelector/SoundSelector'

import acousticGuitar from '../../samples/c3/acousticGuitar.wav'
import brass from '../../samples/c3/brass.wav'
import doubleBassPizz from '../../samples/c3/doubleBassPizz.wav'
import rhodes from '../../samples/c3/rhodes.wav'
import spaceKalimba from '../../samples/c3/spaceKalimba.wav'
import tinnyPiano from '../../samples/c3/tinnyPiano.wav'
import violins from '../../samples/c3/violins.wav'

// SETUP FOR TONEJS ****************************************

// create the synth
let noteEngines = []
for (let i = 0; i < 8; i++) {
    noteEngines.push(new Tone.Synth({
        oscillator: {
            type: 'square'
        },
        envelope: {
            attack: 0.02,
            decay: 0.1,
            sustain: 0.25,
            release: 1
        }
    }))
}

// manage volume
var masterVolume = new Tone.Volume(-10);
noteEngines.forEach(instrument => {
    instrument.chain(masterVolume, Tone.Master);
})
const gain = new Tone.Gain(0.3)

// create effects
const filter = new Tone.Filter({
    type: 'lowpass',
    frequency: 280,
    roloff: -24,
    Q: 1,
    gain: 0
})

const delay = new Tone.PingPongDelay(0.2, 0.4)
delay.wet.value = 0.5;
// delay.toMaster()  // I will attach this functionality to a button down below later

// attach volume and effects to the synth
noteEngines.forEach(synth => {
    synth.connect(filter).connect(gain)
})

// END TONE.JS SETUP ***************************************

class LoopEditor extends Component {
    constructor(props) {
        super(props)
        this.state = {
            title: 'New Loop',
            tempo: 120,
            key: 'c',
            instrument: 'synth',
            rowData: [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]],
            noteIDs: [[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null]],
            scale: ['C4', 'B3', 'A3', 'G3', 'F3', 'E3', 'D3', 'C3'],
            activeNote: null,
            repeatId: null,
            gain: -20,
            bufferLoaded: false
        }
        this.toggleNote = this.toggleNote.bind(this)
        this.playPause = this.playPause.bind(this)
        this.changeTempo = this.changeTempo.bind(this)
        this.changeVolume = this.changeVolume.bind(this)
        this.changeSound = this.changeSound.bind(this)
        this.socket = io.connect(':5647', { secure: true })
        this.socket.on('update note', data => this.toggleNote(data.rowIndex, data.noteIndex))
    }

    async componentDidMount() {
        Tone.Buffer.on('load', () => {
            this.setState({ bufferLoaded: !this.state.bufferLoaded })
        })
        await this.componentWillUnmount()
        this.socket.emit('join room', { room: this.props.match.params.id })
        this.setState({ activeNote: null })
        await Tone.context.suspend()
        await Tone.Transport.toggle()
        try {
            // check if logged in
            const loginData = await axios.get('/auth/me')
            this.props.getUser(loginData.data)
            // check if user has access to loop
            await axios.post(`/auth/loop/${this.props.match.params.id}`)
        } catch (e) {
            await Swal({
                customClass: 'swal-custom',
                customContainerClass: 'swal-container',
                type: 'error',
                title: 'Access Denied',
                text: 'You do not have access to this loop',
                confirmButtonColor: 'rgb(44, 255, 96)',
                confirmButtonText: 'Home',
                backdrop: `
                linear-gradient(69deg, rgba(45, 255, 241, .3), rgba(225, 255, 45, .3))
                `
            })
            return this.props.history.push('/')
        }

        const { id } = this.props.match.params
        try {
            const loopData = await axios.get(`/api/loop/${id}`)
            const { title, key, tempo, instrument, row_1, row_2, row_3, row_4, row_5, row_6, row_7, row_8 } = loopData.data[0]
            const rowArray = [row_1.split(''), row_2.split(''), row_3.split(''), row_4.split(''), row_5.split(''), row_6.split(''), row_7.split(''), row_8.split('')]
            const rowData = rowArray.map(row => {
                return row.map(note => Number(note))
            })
            this.setState({
                rowData, title, key, tempo, instrument
            })
            this.changeSound(this.state.instrument)
        } catch (e) {
            console.log('Loop id does not exist')
        }
        this.initializeSoundEngine()
        if (this.state.instrument === 'synth') {
            this.state.rowData.forEach((row, rowIndex) => {
                row.forEach((note, noteIndex) => {
                    if (note === 1) {
                        this.addNote(rowIndex, noteIndex)
                    }
                })
            })
        }
        await Tone.context.suspend()
        await Tone.Transport.toggle()
    }

    async componentDidUpdate(prevProps, prevState) {
        if (this.props.match.params.id !== prevProps.match.params.id) {
            this.componentWillUnmount()
            this.componentDidMount()
        }
        if (this.state.bufferLoaded !== prevState.bufferLoaded) {
            this.state.rowData.forEach((row, rowIndex) => {
                row.forEach((note, noteIndex) => {
                    if (note === 1) {
                        this.addNote(rowIndex, noteIndex)
                    }
                })
            })
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
        // Create moving barline
        const repeatId = Tone.Transport.scheduleRepeat(() => {
            if (Number.isInteger(this.state.activeNote) && this.state.activeNote !== 15) {
                this.setState({ activeNote: this.state.activeNote + 1 })
            } else {
                this.setState({ activeNote: 0 })
            }
        }, '16n', 0)
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
        const { title, tempo, instrument, key, rowData } = this.state
        const rows = rowData.map(row => (
            row.join('')
        ))
        await axios.put(`/api/loop/${id}`, { title, tempo, instrument, key, row_1: rows[0], row_2: rows[1], row_3: rows[2], row_4: rows[3], row_5: rows[4], row_6: rows[5], row_7: rows[6], row_8: rows[7] })
        Swal({
            customClass: 'swal-custom',
            customContainerClass: 'swal-container',
            type: 'success',
            title: 'Loop Saved',
            text: 'Do you want to keep working on this loop?',
            showCancelButton: true,
            cancelButtonText: 'Stay here',
            confirmButtonColor: 'rgb(44, 255, 96)',
            confirmButtonText: 'Dashboard',
            backdrop: `
            linear-gradient(69deg, rgba(45, 255, 241, .3), rgba(225, 255, 45, .3))
            `
        }).then(result => {
            if (result.value) {
                this.componentWillUnmount()
                this.props.history.push(`/dashboard`)
            }
        })
    }

    async copyLoop() {
        const { title, tempo, instrument, key, rowData } = this.state
        const rows = rowData.map(row => (
            row.join('')
        ))
        const newID = await axios.post(`/api/copy`, { title, tempo, instrument, key, row_1: rows[0], row_2: rows[1], row_3: rows[2], row_4: rows[3], row_5: rows[4], row_6: rows[5], row_7: rows[6], row_8: rows[7] })
        Swal({
            customClass: 'swal-custom',
            customContainerClass: 'swal-container',
            type: 'success',
            title: 'Loop Copied',
            text: 'Do you want to keep working on this loop?',
            showCancelButton: true,
            cancelButtonText: 'Stay here',
            confirmButtonColor: 'rgb(44, 255, 96)',
            confirmButtonText: 'Switch to copy',
            backdrop: `
            linear-gradient(69deg, rgba(45, 255, 241, .3), rgba(225, 255, 45, .3))
            `
        }).then(result => {
            if (result.value) {
                this.componentWillUnmount()
                this.props.history.push(`/loop/${newID.data.loop_id}`)
            }
        })
    }

    async deleteLoop() {
        const { id } = this.props.match.params
        await Swal({
            customClass: 'swal-custom',
            customContainerClass: 'swal-container',
            backdrop: `
            linear-gradient(69deg, rgba(45, 255, 241, .3), rgba(225, 255, 45, .3))
            `,
            title: 'Are you sure?',
            text: "If you have shared this loop, deleting will remove it from other users too!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Delete it!'
        }).then(async (result) => {
            if (result.value) {
                axios.delete(`/api/loop/${id}`)
                    .catch(err => {
                        Swal({
                            customClass: 'swal-custom',
                            customContainerClass: 'swal-container',
                            backdrop: `
                            linear-gradient(69deg, rgba(45, 255, 241, .3), rgba(225, 255, 45, .3))
                            `,
                            title: 'Access Denied',
                            text: `This feature is only available to the loop creator`,
                            type: 'error'
                        })
                        this.props.history.push('/dashboard')
                    })
                this.componentWillUnmount()
                await Swal({
                    customClass: 'swal-custom',
                    customContainerClass: 'swal-container',
                    backdrop: `
                    linear-gradient(69deg, rgba(45, 255, 241, .3), rgba(225, 255, 45, .3))
                    `,
                    title: 'Deleted!',
                    text: 'Your loop has been deleted',
                    type: 'success'
                })
                this.props.history.push('/dashboard')
            }
        })
    }

    resetLoop() {
        this.state.noteIDs.forEach((row, rowIndex) => {
            row.forEach((noteID, noteIndex) => {
                if (noteID) {
                    this.toggleNote(rowIndex, noteIndex)
                }
            })
        })
        // this.componentDidMount()
        Swal({
            customClass: 'swal-custom',
            customContainerClass: 'swal-container',
            backdrop: `
            rgba(0,0,0,0)
            `,
            position: 'top-end',
            type: 'success',
            title: `Loop reset`,
            showConfirmButton: false,
            timer: 1000
        })
    }

    async shareLoop() {
        const { id } = this.props.match.params
        const { value: email } = await Swal({
            customClass: 'swal-custom',
            customContainerClass: 'swal-container',
            backdrop: `
            linear-gradient(69deg, rgba(45, 255, 241, .3), rgba(225, 255, 45, .3))
            `,
            title: 'Share Loop',
            input: 'email',
            inputClass: 'swal2-input',
            inputPlaceholder: `Email`,
            showCancelButton: 'true',
            confirmButtonText: 'Share',
        })
        if (email) {
            try {
                const res = await axios.post(`/api/share/${id}`, { email })
                Swal({
                    customClass: 'swal-custom',
                    customContainerClass: 'swal-container',
                    backdrop: `
                    linear-gradient(69deg, rgba(45, 255, 241, .3), rgba(225, 255, 45, .3))
                    `,
                    type: 'success',
                    title: 'Shared!',
                    text: res.data.message
                })
            } catch (err) {
                console.log(err)
                Swal({
                    customClass: 'swal-custom',
                    customContainerClass: 'swal-container',
                    backdrop: `
                    linear-gradient(69deg, rgba(45, 255, 241, .3), rgba(225, 255, 45, .3))
                    `,
                    type: 'warning',
                    title: 'Awkward...',
                    text: `This email does not have an account! 
                    We'll send an invite to join you on Ostinato. :)`
                })
            }
        }

    }

    addNote(rowIndex, noteIndex) {
        const noteID = Tone.Transport.schedule(
            () => noteEngines[rowIndex].triggerAttackRelease(this.state.scale[rowIndex], '16n'),
            // Tone.Draw.schedule(() => console.log('hit')),
            `0:0:${noteIndex % 16}`)
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
        if (this.state.gain <= -30) {
            masterVolume.mute = true
        } else {
            masterVolume.volume.mute = false
        }
    }

    async toggleNote(rowIndex, noteIndex) {
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
        // (below) Save new note to database immediately so users joining the editor view will be in sync
        const { id } = this.props.match.params
        const { title, tempo, instrument, key, rowData } = this.state
        const rows = rowData.map(row => (
            row.join('')
        ))
        await axios.put(`/api/loop/${id}`, { title, tempo, instrument, key, row_1: rows[0], row_2: rows[1], row_3: rows[2], row_4: rows[3], row_5: rows[4], row_6: rows[5], row_7: rows[6], row_8: rows[7] })
    }

    playPause() {
        if (Tone.context.state !== 'running') {
            this.setState({
                activeNote: null
            })
            Tone.context.resume()
            Tone.Transport.toggle()
        } else {
            Tone.context.suspend()
            Tone.Transport.toggle()
            this.setState({
                activeNote: null
            })
        }
    }

    async changeSound(sampleSelection) {
        Tone.context.suspend()
        let sampleToLoad = null
        switch (sampleSelection) {
            case 'acousticGuitar':
                sampleToLoad = acousticGuitar
                this.setState({ instrument: 'acousticGuitar' })
                break;
            case 'brass':
                sampleToLoad = brass
                this.setState({ instrument: 'brass' })
                break;
            case 'doubleBassPizz':
                sampleToLoad = doubleBassPizz
                this.setState({ instrument: 'doubleBassPizz' })
                break;
            case 'rhodes':
                sampleToLoad = rhodes
                this.setState({ instrument: 'rhodes' })
                break;
            case 'spaceKalimba':
                sampleToLoad = spaceKalimba
                this.setState({ instrument: 'spaceKalimba' })
                break;
            case 'tinnyPiano':
                sampleToLoad = tinnyPiano
                this.setState({ instrument: 'tinnyPiano' })
                break;
            case 'violins':
                sampleToLoad = violins
                this.setState({ instrument: 'violins' })
                break;
            default:
                break;
        }

        if (sampleSelection !== 'synth') {
            for (let i = 0; i < 8; i++) {
                noteEngines[i] = (new Tone.Sampler({
                    "C3": sampleToLoad,
                }))
            }
        } else if (sampleSelection === 'synth') {
            this.setState({ instrument: 'synth' })
            for (let i = 0; i < 8; i++) {
                noteEngines[i] = (new Tone.Synth({
                    oscillator: {
                        type: 'square'
                    },
                    envelope: {
                        attack: 0.02,
                        decay: 0.1,
                        sustain: 0.25,
                        release: 1
                    }
                }))
            }
        }
        noteEngines.forEach(instrument => {
            instrument.chain(masterVolume, Tone.Master);
        })
        noteEngines.forEach(synth => {
            synth.connect(gain)
        })
        Swal({
            customClass: 'swal-custom',
            customContainerClass: 'swal-container',
            backdrop: `
            rgba(0,0,0,0)
            `,
            position: 'center',
            type: 'success',
            title: `${sampleSelection} loaded!`,
            showConfirmButton: false,
            timer: 1000
        })
    }

    // TODO: AUDIO VISUALIZER! I haven't nailed down waveform data yet - it is giving me an array of 0s.
    // audioVisualizer() {
    //     const analyser = new Tone.Waveform(32)
    //     Tone.Master.connect(analyser)
    //     // analyser.connect(Tone.Master)
    //     console.log(analyser.getValue())
    // }

    sendNote = (rowIndex, noteIndex) => {
        this.socket.emit(`change note`, {
            room: this.props.match.params.id,
            rowIndex: rowIndex,
            noteIndex: noteIndex
        })
    }

    render() {
        let progressStyle = {
            width: `${Tone.Transport.progress * 107}vw`,
            backgroundImage: `linear-gradient(to right, rgba(226, 255, 51, .2), rgba(45, 255, 241, .2)`,
            height: `calc(100vh - 60px)`,
            position: `absolute`,
            left: 0,
            top: `60px`,
            zIndex: -5,
            transition: `.2s`
        }
        return (
            <div className='constant-background'>
                <div className="resize-instruction"><h1>Please turn to landscape mode!</h1></div>
                <div className='changing-background' style={progressStyle}></div>
                <div className='loop-title-bar'>
                    <div>
                        <i
                            className='fas fa-arrow-left fa-2x'
                            onClick={() => this.props.history.push('/dashboard')}
                        />
                        <input
                            type='text'
                            value={this.state.title}
                            onChange={e => this.handleChange('title', e)}
                        />
                        <i
                            className='fas fa-save fa-2x'
                            onClick={() => this.saveLoop()}
                        />
                    </div>
                    <div>
                        <i
                            className='fas fa-copy fa-2x'
                            onClick={() => this.copyLoop()}
                        />
                        <i
                            className='fas fa-trash fa-2x'
                            onClick={() => this.deleteLoop()}
                        />
                        <i
                            className='fas fa-undo fa-2x'
                            onClick={() => this.resetLoop()}
                        />
                        <i
                            className='fas fa-share-square fa-2x'
                            onClick={() => this.shareLoop()}
                        />
                    </div>
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
                            sendFn={this.sendNote}
                        />
                    ))}
                </div>
                <div className='loop-settings-bar'>
                    <div className='volume-info'>
                        <span><span>{Number(this.state.gain) + 30}</span><span>Volume</span></span>
                        <VolumeSlider
                            gain={this.state.gain}
                            changeFn={this.changeVolume}
                        />
                        <SoundSelector
                            loadFn={this.changeSound}
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

export default connect(null, { getUser })(LoopEditor)