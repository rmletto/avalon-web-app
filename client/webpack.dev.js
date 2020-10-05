const path = require("path");
const webpack = require("webpack");
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: "development",
    devServer: {
        port: 3000,
        hotOnly: true,
        historyApiFallback: true
    },
    devtool: "source-map",
    plugins: [new webpack.HotModuleReplacementPlugin()]
});