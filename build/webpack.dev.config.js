const path = require('path')
const HtmlWebPackPlugin = require("html-webpack-plugin");
const webpack = require('webpack');
const merge = require('webpack-merge')
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const webpackBase = require('./webpack.base');
const config = require('./config');

const devConfig = merge(webpackBase, {
    module: {
        rules: [
            {
                test: /\.js|.jsx$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader?cacheDirectory"
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
                test: /\.(png|jpg|gif|svg)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                    }
                }]
            },
            {
                test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                loader: require.resolve('url-loader'),
                options: {
                    limit: 10000,
                    name: 'static/media/[name].[ext]',
                },
            },
        ]
    },
    devtool: 'eval',    
    devServer: {
        // contentBase: '', //默认webpack-dev-server会为根文件夹提供本地服务器，如果想为另外一个目录下的文件提供本地服务器，应该在这里设置其所在目录（本例设置到"build"目录）
        historyApiFallback: true, //在开发单页应用时非常有用，它依赖于HTML5 history API，如果设置为true，所有的跳转将指向index.html
        // compress: true,   // 开启gzip压缩
        hot: true,
        host: '0.0.0.0',  // 同一局域网段下，可以通过IP (192.168.X.X:8000) 访问
        inline: true, //设置为true，当源文件改变时会自动刷新页面
        port: config.dev.port, //设置默认监听端口，如果省略，默认为"8083"
        proxy: {    // 设置代理解决跨域问题
            // '/': {
            //     target: 'http://localhost:8083/', // 目标服务器地址
            //     secure: false,
            //     withCredentials: true
            // }
        }
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: "public/index.html",
            filename: "index.html",
            env: 'development'
        }),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"development"'
        }),
        new ExtractTextPlugin({
            filename: '[name].css'
        })
    ]
})

module.exports = devConfig;