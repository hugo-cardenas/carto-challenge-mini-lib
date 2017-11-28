const merge = require('webpack-merge');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const commonConfig = require('./webpack.common.js');

module.exports = merge(commonConfig, {
    plugins: [
        new CleanWebpackPlugin(
            ['../dist'],
            { allowExternal: true }
        ),
        new UglifyJSPlugin()
    ]
});