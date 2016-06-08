'use strict';

const path = require('path');
const webpack = require('webpack');

module.exports = {
    module: {
        loaders: [{
            test: /\.jsx?$/,
            exclude: /node_modules/i,
            loader: 'babel-loader',
            query: {
                presets: ['es2015-webpack'],
                cacheDirectory: true,
            },
        }],
    },
    entry: {
        'oly-dialog': './src/index.js',
    },
    output: {
        path: path.resolve('./dist'),
        filename: '[name].min.js',
        library: 'default',
        libraryTarget: 'commonjs2',
    },
    externals: {
        angular: 'var angular',
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin(),
    ],
};
