const path = require('path');
const {
    CleanWebpackPlugin
} = require('clean-webpack-plugin');

const HtmlWebPackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: {
        app: './src/index.js',
    },
    plugins: [
        // new CleanWebpackPlugin(['dist/*']) for < v2 versions of CleanWebpackPlugin
        new CleanWebpackPlugin(),
        new HtmlWebPackPlugin({
            template: "./src/index.html",
            filename: "./index.html"
          })
    ],
    resolve: {
        extensions: ["*", ".js", ".jsx"]
    },
    module: {
        rules: [{
                test: /\.(js|jsx)$/,
                exclude: /(node_modules|bower_components)/,
                loader: "babel-loader",
                options: {
                    presets: ["@babel/env"]
                }
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.(jpe?g|gif|png|svg)$/i,
                use: [{
                    loader: "url-loader",
                    options: {
                        limit: 25000
                    }
                }]
            },
            {
                test: /\.html$/,
                use: [{
                    loader: "html-loader"
                }]
            }
        ]
    }
};