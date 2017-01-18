var webpack = require('webpack');
var path = require('path');
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');

var dir = path.join(__dirname, '..', 'resources', 'gen');

const IS_PRODUCTION = process.env.IS_PRODUCTION === 'true';

const ENV_VARS = [
  'SLACK_CLIENT_ID',
  'SLACK_TEAM',
  'TEAM_NAME'
];

// Look for missing env vars.
let missing_env = false;
ENV_VARS.forEach(function (env_var) {
  if (!(env_var in process.env)) {
    console.error(
      'Environmental variable ' + env_var +
      ' must be set for Webpack build.');
    missing_env = true;
  } else {
    console.log(env_var + ':');
    console.log(process.env[env_var]);
  }
});
if (missing_env) {
  process.exit(1);
}

const PLUGIN_CONFIG = [
  new webpack.EnvironmentPlugin(ENV_VARS)
];

if (IS_PRODUCTION) {
  PLUGIN_CONFIG.push(new ParallelUglifyPlugin({uglifyJS: {minimize: true}}));
  PLUGIN_CONFIG.push(new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': '"production"'
    }
  }));
}

module.exports = {
  entry: ['whatwg-fetch', './src/app.js'],
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
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /(node_modules)/,
        query: {
          presets: ['es2015', 'react']
        },
        progress: true
      },
      {test: /\.css$/, loader: 'style!css'},
      {test: /\.scss$/, loaders: ['style-loader', 'css-loader', 'sass-loader']},
      {test: /\.(otf|eot|svg|ttf|woff|woff2).*$/, loader: 'url?limit=8192'}
    ]
  },
  plugins: PLUGIN_CONFIG
};
