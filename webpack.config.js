const path = require('path')  //引入path模块
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');
const pxtorem = require('postcss-pxtorem');

const Visualizer = require('webpack-visualizer-plugin'); // remove it in production environment.
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin; // remove it in production environment.
const otherPlugins = process.argv[1].indexOf('webpack-dev-server') >= 0 ? [] : [
    new Visualizer(), // remove it in production environment.
    new BundleAnalyzerPlugin({
        defaultSizes: 'parsed',
        // generateStatsFile: true,
        statsOptions: {source: false}
    }), // remove it in production environment.
];

const postcssOpts = {
    ident: 'postcss', // https://webpack.js.org/guides/migrating/#complex-options
    plugins: () => [
        autoprefixer({
            browsers: ['last 2 versions', 'Firefox ESR', '> 1%', 'ie >= 8', 'iOS >= 8', 'Android >= 4'],
        }),
        // pxtorem({ rootValue: 100, propWhiteList: [] })
    ],
};

module.exports = {
    devtool: 'source-map', // or 'inline-source-map'
    devServer: {
        disableHostCheck: true
    },

    entry: {"index": path.resolve(__dirname, 'src/index')}, /*指向spa应用的入口文件*/

    output: {
        filename: '[name].js',
        chunkFilename: '[id].chunk.js',
        path: path.join(__dirname, '/dist'), /*输出的文件路径*/
        publicPath: '/dist/'
    },

    resolve: {
        modules: [path.resolve(__dirname, 'node_modules'), path.join(__dirname, 'src')],
        extensions: ['.web.js', '.jsx', '.js', '.json'],
    },

    module: {
        rules: [
            {
                test: /\.jsx$/,    //用正则匹配文件路径,匹配js或者jsx
                exclude: /node_modules/,   //排除
                loader: 'babel-loader',    //加载模块
                options: {
                    plugins: [
                        'external-helpers', // why not work?
                        ["transform-runtime", {polyfill: false}],
                        ["import", [{"style": "css", "libraryName": "antd-mobile"}]]
                    ],
                    presets: ['es2015', 'stage-0', 'react']  //使用babel中的某些插件
                    // presets: [['es2015', { modules: false }], 'stage-0', 'react'] // tree-shaking
                }
            },
            {
                test: /\.(jpg|png)$/,
                loader: "url-loader?limit=8192"
            },
            // 注意：如下不使用 ExtractTextPlugin 的写法，不能单独 build 出 css 文件
            // { test: /\.less$/i, loaders: ['style-loader', 'css-loader', 'less-loader'] },
            // { test: /\.css$/i, loaders: ['style-loader', 'css-loader'] },
            {
                test: /\.less$/i,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        'css-loader', {loader: 'postcss-loader', options: postcssOpts}, 'less-loader'
                    ]
                })
            },
            {
                test: /\.css$/i,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        'css-loader', {loader: 'postcss-loader', options: postcssOpts}
                    ]
                })
            }
        ]
    },
    externals: {
        "react": "React",
        "react-dom": "ReactDOM"
    },
    plugins: [
        new webpack.optimize.ModuleConcatenationPlugin(),
        // new webpack.optimize.CommonsChunkPlugin('shared.js'),
        //分离第三方应用的插件
        new webpack.optimize.CommonsChunkPlugin({
            // minChunks: 2,
            name: 'shared',
            filename: 'shared.js'
        }),
        //抽取CSS文件插件
        new ExtractTextPlugin({filename: '[name].css', allChunks: true}),
        ...otherPlugins
    ]
}
