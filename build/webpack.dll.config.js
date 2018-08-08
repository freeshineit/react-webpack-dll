const path = require('path')
const webpack = require('webpack')
const HtmlWebPackPlugin = require("html-webpack-plugin");

const ROOT_PATH = path.resolve(__dirname);

const vendors = [
    'react',
    'react-dom',
    'react-router-dom',
    'babel-polyfill'
];

module.exports = {
    entry: {
        vendor: vendors,
    },
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: '[name].[hash].js',
        library: '[name]_lib',
    },
    plugins: [
        new webpack.DllPlugin({
            path: path.resolve(ROOT_PATH, 'lib', 'manifest.json'),
            name: '[name]_lib',
            context: ROOT_PATH,
        })
    ],
}