const path = require('path');
const webpack = require('webpack');
const CleanPlugin = require('clean-webpack-plugin');

const PATHS = {
  src: path.join(__dirname, 'client'),
  build: path.join(__dirname, 'anylog/static/build'),
  webroot: 'https://anylog.xyz',
};

module.exports = {
  devtool: 'source-map',
  output: {
    path: PATHS.build,
    publicPath: 'static/build/',
    filename: 'bundle.js',
  },
  entry: {
    src: PATHS.src,
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
  plugins: [
    new webpack.DefinePlugin({
      'GLOBAL.API_ROOT_VERSIONED': JSON.stringify(`${PATHS.webroot}/api/v0.2`),
      'GLOBAL.API_ROOT': JSON.stringify(`${PATHS.webroot}/api`),
    }),
    new CleanPlugin('static'),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.MinChunkSizePlugin({
      minChunkSize: 51200, // ~50kb
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    new webpack.optimize.UglifyJsPlugin({
      mangle: false,
      compress: {
        warnings: false, // Suppress uglification warnings
      },
    }),
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        loaders: ['style', 'css', 'sass'],
      },
      {
        test: /\.css$/,
        loaders: ['style', 'css'],
      },
      {
        test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&mimetype=application/font-woff',
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&mimetype=application/octet-stream',
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file',
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&mimetype=image/svg+xml',
      },
    ],
  },
};
