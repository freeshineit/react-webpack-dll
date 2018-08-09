import React, {Component} from 'react';
import logo from '../../public/images/logo.svg';
import './style.less';

export default class App extends Component {
    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className='App-logo' />
                    <h1 className="App-title">Welcome to React</h1>
                </header>
            </div>
        );
    }
}