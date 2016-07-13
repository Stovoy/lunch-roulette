var webpack = require('webpack');
var path = require('path');
var dir = path.join(__dirname, '..', 'resources');

var MINIFY = JSON.parse(process.env.MINIFY || "0");
var CONFIG = [
    new webpack.EnvironmentPlugin([
        'SLACK_CLIENT_ID',
        'SLACK_TEAM'])
];

module.exports = {
    entry: './src/app.js',
    output: {
        path: dir,
        filename: 'bundle.js'
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    module: {
        loaders: [
            {
                test: /\.(js|jsx)$/,
                exclude: /(node_modules)/,
                loader: 'babel',
                query: {
                    presets: ['react', 'es2015']
                }
            },
            {test: /\.css$/, loader: 'style!css'},
            {test: /\.less$/, loader: 'style!css!less'},
        ]
    },
    devServer: {
        proxy: {
            '/api/*': {
                target: 'http://127.0.0.1:8000',
                secure: false
            }
        },
        historyApiFallback: true
    },
    plugins: MINIFY ? CONFIG.concat([
        new webpack.optimize.UglifyJsPlugin({minimize: true}),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        })
    ]) : CONFIG
};
