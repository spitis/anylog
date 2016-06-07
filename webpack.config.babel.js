const path = require('path');
const webpack = require('webpack');

const PATHS = {
  src: path.join(__dirname, 'client'),
  build: path.join(__dirname, 'static'),
};

module.exports = {
  output: {
    path: PATHS.build,
    publicPath: 'static',
    filename: 'bundle.js',
  },
  plugins: [
    new webpack.DefinePlugin({
      'GLOBAL.API_ROOT': JSON.stringify('http://localhost:3334/api/v0.2'),
    }),
  ],
  entry: {
    src: PATHS.src,
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
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
