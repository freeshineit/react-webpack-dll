const path = require('path')
const HtmlWebPackPlugin = require("html-webpack-plugin");
const webpack = require('webpack');
const merge = require('webpack-merge')
const webpackBase = require('./webpack.base');
const config = require('./config');

const devConfig = merge(webpackBase, {
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
    devtool: 'eval-source-map',
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        compress: true,
        port: config.dev.port
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: "public/index.html",
            filename: "index.html"
        }),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"development"'
        })
    ]
})

module.exports = devConfig;