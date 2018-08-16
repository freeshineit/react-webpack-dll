import React, {Component} from 'react';
import { renderRoutes } from 'react-router-config'
import routes from './containers/routes';
import {BrowserRouter} from 'react-router-dom';

class Root extends Component{

    render() {
        return (
            <BrowserRouter>
                {
                    renderRoutes(routes)
                }
            </BrowserRouter>
        );
    }
}

export default Root;