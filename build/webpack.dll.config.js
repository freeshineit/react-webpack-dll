const path = require('path')
const webpack = require('webpack')
const fs = require('fs');
const config = require('./config.js');
const HtmlWebPackPlugin = require("html-webpack-plugin");
var ManifestPlugin = require('webpack-manifest-plugin');
const manifestPath = path.join(__dirname, '../dist/manifest.json');
const ROOT_PATH = path.resolve(__dirname);

const vendors = [
    'react',
    'react-dom',
    'react-router-dom',
    'react-router-config',
    'babel-polyfill'
];

module.exports = () => {

    let _manifest = {};
    if (fs.existsSync(manifestPath)) {
        _manifest = fs.readFileSync(manifestPath);
        if (_manifest) {
            _manifest = JSON.parse(_manifest);
        }
    }

    return {
        entry: {
            [config.pro.vendor]: vendors,
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
            }),
            new ManifestPlugin({ // 生成manifest.json文件 
                fileName: manifestPath,
                generate: (seed, files) => files.reduce((manifest, {
                    name,
                    path
                }) => {
                    manifest[name] = path
                    return Object.assign(manifest, _manifest);
                }, seed)
            })
        ],
    }
};