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
        // path: path.resolve(__dirname, '../dist'),
        // publicPath: `http://localhost:${config.dev.port}/`
    },
    resolve: {
        extensions: ['.js', '.jsx', '.less']
    }
};
