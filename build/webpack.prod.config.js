const path = require('path')
const HtmlWebPackPlugin = require("html-webpack-plugin");
const webpack = require('webpack');

const ROOT_PATH = path.resolve(__dirname);

module.exports = {
    entry: {
        polyfill: 'babel-polyfill',
        app: [
            path.resolve(__dirname, '../src/index.js'),
        ]
    },
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: '[name]_[hash].js',
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                include: path.resolve(__dirname, '../src'),
                use: {
                    loader: "babel-loader"
                }
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx', '.less', '.css']
        //root: APP_PATH
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: "public/index.html",
            filename: "index.html"
        }),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({
            // 'process.env.NODE_ENV': '"production"'
        }),
        new webpack.DllReferencePlugin({
            manifest: require(path.resolve(__dirname, 'lib', 'manifest.json')),
            context: ROOT_PATH,
        })
    ]
};

