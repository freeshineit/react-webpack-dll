import React, {Component} from 'react';
import { App} from './containers/children';
class Root extends Component{

    render() {
        return (
            <div>
                <App />
            </div>
        );
    }
}

export default Root;