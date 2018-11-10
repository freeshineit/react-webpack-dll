const path = require('path')
const HtmlWebPackPlugin = require("html-webpack-plugin");
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const shell = require('shelljs');
const fs = require('fs');
const theme = require('./less');
const config = require('./config');
const manifestPath = path.join(__dirname, '../dist/manifest.json');

module.exports = async () => {
    let _manifest = {};
    if (fs.existsSync(manifestPath)) {
        _manifest = fs.readFileSync(manifestPath);
        if (_manifest) {
            _manifest = JSON.parse(_manifest);
        }
    }

    return {
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
                    test: /\.less$/,
                    loader: ExtractTextPlugin.extract({
                        fallback: 'style-loader',
                        use: [
                            {loader:'css-loader'},
                            { 
                                loader: 'less-loader',
                                options: {
                                    modifyVars: theme,
                                    javascriptEnabled: true,
                                },
                            }
                        ]
                    }),
                },
                {
                    test: /\.css$/,
                    loader: ExtractTextPlugin.extract({
                        fallback: 'style-loader',
                        use: ['css-loader']
                    }),
                },
                {
                    test: /\.(png|jpg|gif|svg)$/,
                    use: [{
                        loader: 'file-loader',
                        options: {
                            limit: 10000,
                            name: 'images/[name].[ext]',
                        }
                    }]
                },
                {
                    test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                    loader: require.resolve('url-loader'),
                    options: {
                        limit: 10000,
                        name: 'media/[name].[ext]',
                    },
                },
            ]
        },
        resolve: {
            extensions: [
                '.mjs',
                '.web.js',
                '.js',
                '.json',
                '.web.jsx',
                '.jsx',
                '.less',
                '.js',
                '.css'
            ]
        },
        plugins: [
            new HtmlWebPackPlugin({
                template: "public/index.html",
                filename: "index.html",
                env: 'production',
                minify: true,
                vendor: _manifest[`${[config.pro.vendor]}.js`]
            }),
            new webpack.DllReferencePlugin({
                manifest: require(path.resolve(__dirname, 'lib', 'manifest.json')),
                context: path.resolve(__dirname),
            }),
            new ExtractTextPlugin({
                filename: '[name].[hash].css',
                disable: false,
                allChunks: true
            }),
            new ManifestPlugin({ // 生成manifest.json文件 
                fileName: manifestPath,
                generate: (seed, files) => files.reduce((manifest, {
                    name,
                    path
                }) => {
                    const pathMatch = path.match(/\.(js|css)$/);
                    if (pathMatch)
                        manifest[name] = path
                    return Object.assign(manifest, _manifest);
                }, seed)
            })
        ]
    }
};

