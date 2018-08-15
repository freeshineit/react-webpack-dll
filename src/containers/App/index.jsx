import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import { renderRoutes } from 'react-router-config'
import logo from '../../public/images/logo.svg';
import './style.less';

class App extends Component {
    render() {
        const {route} = this.props;

        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className='App-logo' />
                    <h1 className="App-title">Welcome to React</h1>
                </header>
                <Link to='/'>Home</Link>
                <Link to='/data'>Data</Link>
                {
                    renderRoutes(route.routes)
                }
            </div>
        );
    }
}

export default App