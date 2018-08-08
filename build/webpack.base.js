const path = require('path');
const config = require('./config');

module.exports = {
    entry: {
        app: [
            'babel-polyfill',
            path.resolve(__dirname, '../src/index.js')
        ]
    },
    output: {
        filename: '[name].js',
    },
    resolve: {
        extensions: ['.js', '.jsx', '.less', '.css']
    }
};
