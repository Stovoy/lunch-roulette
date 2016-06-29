var webpack = require('webpack');
var path = require('path');
var dir = path.join(__dirname, '..', 'resources');

var MINIFY = JSON.parse(process.env.MINIFY || "0");

module.exports = {
  entry: './scripts/app.js',
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
      { test: /\.css$/, loader: 'style!css' },
      { test: /\.less$/, loader: 'style!css!less' },
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
  plugins: MINIFY ? [
    new webpack.optimize.UglifyJsPlugin({minimize: true})
  ] : []
};
