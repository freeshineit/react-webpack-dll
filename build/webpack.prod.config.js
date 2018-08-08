const path = require('path')
const HtmlWebPackPlugin = require("html-webpack-plugin");
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const ROOT_PATH = path.resolve(__dirname);

module.exports = {
    entry: {
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
            },
            {
                test: /\.less|css$/,
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', `less-loader?{"sourceMap":true}`]
                }),
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]?[hash]',
                        // useRelativePath: true,
                        // publicPath: `http://localhost:${scriptConfig.port}/images/`
                    }
                }]
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx', '.less', '.css']
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: "public/index.html",
            filename: "index.html",
            minify: true
        }),
        new webpack.DllReferencePlugin({
            manifest: require(path.resolve(__dirname, 'lib', 'manifest.json')),
            context: ROOT_PATH,
        }),
        new ExtractTextPlugin({
            filename: '[name].[hash].css',
            disable: false,
            allChunks: true
        })
    ]
};

