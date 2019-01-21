import React, { Component } from 'react'
import './SoundSelector.scss'

export default class SoundSelector extends Component {
    state = {
        selection: 'synth'
    }
    render() {
        return (
            <div className='sound-selector'>
                <select name="soundSelector" onChange={async e => {
                    await this.setState({ selection: e.target.value })
                    this.props.loadFn(this.state.selection)
                }}>
                    <option selected disabled>Change Instrument</option>
                    <option value="acousticGuitar">Acoustic Guitar</option>
                    <option value="brass">Brass</option>
                    <option value="doubleBassPizz">Double Bass Pizzicato</option>
                    <option value="rhodes">Classic Rhodes</option>
                    <option value="spaceKalimba">Space Kalimba</option>
                    <option value="tinnyPiano">Tinny Piano</option>
                    <option value="violins">Violins</option>
                    <option value="synth">Synth</option>
                </select>
                <div className="select_arrow">
                </div>
            </div>
        )
    }
}