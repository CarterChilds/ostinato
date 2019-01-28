import React, { Component } from 'react'
import './KeySelector.scss'

export default class KeySelector extends Component {
    state = {
        selection: 'c'
    }
    render() {
        return (
            <div className='key-selector'>
                <select defaultValue='c' name="keySelector" onChange={async e => {
                    await this.setState({ selection: e.target.value })
                    this.props.loadFn(this.state.selection)
                }}>
                    <option disabled value='c'>Change Key</option>
                    <option value="c">C Major</option>
                    <option value="cm">C minor</option>
                    <option value="c#">C# Major</option>
                    <option value="c#m">C# minor</option>
                    <option value="d">D Major</option>
                    <option value="dm">D minor</option>
                    <option value="eb">Eb Major</option>
                    <option value="ebm">Eb minor</option>
                    <option value="e">E Major</option>
                    <option value="em">E minor</option>
                    <option value="f">F Major</option>
                    <option value="fm">F minor</option>
                    <option value="f#">F# Major</option>
                    <option value="f#m">F# minor</option>
                    <option value="g">G Major</option>
                    <option value="gm">G minor</option>
                    <option value="ab">Ab Major</option>
                    <option value="abm">Ab minor</option>
                    <option value="a">A Major</option>
                    <option value="am">A minor</option>
                    <option value="bb">Bb Major</option>
                    <option value="bbm">Bb minor</option>
                </select>
                <div className="select_arrow">
                </div>
            </div>
        )
    }
}