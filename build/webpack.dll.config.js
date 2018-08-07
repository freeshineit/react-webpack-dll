const path = require('path')
const webpack = require('webpack')

const ROOT_PATH = path.resolve(__dirname);

const vendors = [
    'react',
    'react-dom',
    'react-router-dom'
];

module.exports = {
    entry: {
        vendor: vendors,
    },
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: '[name]_[hash].js',
        library: '[name]_lib',
    },
    module: {
        rules: [
            {
                test: /\.js|.jsx$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            }
        ]
    },
    plugins: [
        new webpack.DllPlugin({
            path: path.resolve(ROOT_PATH, 'lib', 'manifest.json'),
            name: '[name]_lib',
            context: ROOT_PATH,
        }),
    ],
}