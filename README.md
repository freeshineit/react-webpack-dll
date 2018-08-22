#  React webpack dll 优化

## install

```sh
git clone git@github.com:freeshineit/react-webpack-dll.git

cd react-webpack-dll

npm install

#或者

yarn install 

# 开发环境
npm run dev

# 单独打包依赖包文件， 一次打包全局使用， 当包更新时需重新打包
npm run dll 

# 生产环境
npm run build

```

## structure
```
.
├── build
│   ├── config.js
│   ├── index.js
│   ├── lib
│   ├── webpack.base.js
│   ├── webpack.dev.config.js
│   ├── webpack.dll.config.js
│   ├── webpack.plugins.js
│   └── webpack.prod.config.js
├── dist
│   ├── app.deac0144e9956c30ca85.css
│   ├── app_deac0144e9956c30ca85.js
│   ├── images
│   ├── index.html
│   ├── manifest.json
│   └── vendor.d0390cca802aaa5fdfb2.js
├── public
│   └── index.html
├── src
│   ├── Root.jsx
│   ├── containers
│   ├── index.js
│   └── public
├── package.json
├── LICENSE
├── README.md
└── yarn.lock
```

+   `build` webpack4配置
    +   `config.js` -- 全局变量
    +   `index.js` -- 生产环境编译入口
    +   `lib` -- webpack 的`DllPlugin`处理公共包时生成的`manifest.json`
    +   `webpack.base.js` -- 公共配置
    +   `webpack.dev.config.js` -- 开发环境配置
    +   `webpack.dll.config.js` -- 生产环境单独打包公共包配置
    +   `webpack.prod.config.js` -- 生存环境的配置

+   `dist` 生产环境打包生成的文件夹，静态资源。
    +   `app.[hash].css` -- 编译生成的样式表文件
    +   `app.[hash].js` -- 编译生成的js文件
    +   `images` -- 静态资源图片
    +   `index.html` -- 页面入口
    +   `manifest.json` -- 最新css、js文件的路径的映射
    +   `vendor.[hash].js`  -- 公共包打包生成的文件

+   `public` 存放模版文件
    +   `index.html` -- html模版

+   `src` 源码
    +   `Root.jsx` -- Root组件
    +   `containers` -- 页面组件文件夹
    +   `index.js` -- 入口组件
    +   `public` -- 公共资源文件夹


## webpack

`webpack` 配置都在`build`文件夹下

+   `webpack.dev.config.js`

    +   loader配置

            ```js
            module: {
                rules: [
                    {
                        test: /\.jsx?$/,
                        exclude: /node_modules/,
                        use: ['babel-loader?cacheDirectory', 'eslint-loader']
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
                        loader: 'url-loader',
                        options: {
                            limit: 10000,
                            name: 'static/media/[name].[ext]',
                        },
                    },
                ]
            }
            ```

    +   plugins

            ```js
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
            ```

+   `webpack.dll.config.js` 

    +   plugins

            ```js
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
            ]
            ```

+   `webpack.prod.config.js`

    +   plaugins
    
        ```js
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
        ```

## webpack-dev-server

在开发环境中使用`webpack-dev-server`，用来开启一个本地服务。

1. 安装依赖

    ```sh
    npm install webpack-dev-server --save-dev
    ```

2. 环境配置（[webpack.dev.config.js](./build/webpack.dev.config.js)）

    ```js
    devServer: {
        // contentBase: '', //默认webpack-dev-server会为根文件夹提供本地服务器，如果想为另外一个目录下的文件提供本地服务器，应该在这里设置其所在目录（本例设置到"build"目录）
        historyApiFallback: true, //在开发单页应用时非常有用，它依赖于HTML5 history API，如果设置为true，所有的跳转将指向index.html
        // compress: true,   // 开启gzip压缩
        hot: true,
        host: '0.0.0.0',  // 同一局域网段下，可以通过IP访问
        inline: true, //设置为true，当源文件改变时会自动刷新页面
        port: config.dev.port, //设置默认监听端口，如果省略，默认为"8083"
        proxy: {    // 设置代理解决跨域问题
            // '/': {
            //     target: 'http://localhost:8083/', // 目标服务器地址
            //     secure: false,
            //     withCredentials: true
            // }
        }
    }
    ```

## eslint

1. 安装依赖

    ```sh
    npm install babel-eslint eslint eslint-plugin-react eslint-loader --save-dev
    ```
2. 在根目录下创建[.eslintrc.json](./.eslintrc.json)文件，添加eslint语法检查规则

3. 在`webpack.dev.config.js`配置`eslint-loader`

    ```js
    rules: [
        {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: ['babel-loader?cacheDirectory', 'eslint-loader']
        },
        ...
    ]
    ```
## babel-plugin-root-import

为了组件的引用方便,项目使用了`babel-plugin-root-import`插件。其配置在[.babelrc](./.babelrc)文件中。

`src/containers/children.js`

```jsx
import Data from '~/containers/Data';
import Home from '~/containers/Home';
export {
    Home,
    Data
};
```


## antd

```sh
npm i antd

npm i babel-plugin-import --save-dev
```


### config

在`.babelrc`中添加插件

```json
"plugins": [
    [
         "import",
        {
            "libraryName": "antd",
            "libraryDirectory": "es",
            "style": true
        }
    ]
]
```

配置主题,创建一个主题配置文件`less.js`


```js
module.exports = {
    'primary-color': '#f34949',
    'link-color': '#1DA57A',
    'border-radius-base': '2px',
    'font-size-base': '12px',
};
```

`webpack`配置

```js
{
    test: /\.less$/,
    loader: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [
            'css-loader',
            { 
                loader: `less-loader?{"sourceMap":true,"modifyVars":${JSON.stringify(theme)}}`,
                options: {
                    javascriptEnabled: true // less@3.x.x
                }
            }
        ]
    }),
}
```

注意️⚠️：

```js
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
    }
```

## License

MIT © [Shine Shao](https://github.com/freeshineit)



