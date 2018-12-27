const path = require('path');
const webpack = require('webpack');
const version = require("./package.json").version;
module.exports = {
    plugins: [
        new webpack.BannerPlugin({
            raw: true,
            entryOnly: true,
            banner: `// ==UserScript==
// @name        codemirror-anywhere
// @namespace   http://efcl.info/
// @description codemirror-anywhere
// @include     http://*
// @include     https://*
// @version     ${version}
// @grant       none
// ==/UserScript==
`
        })
    ],
    module: {
        rules: [
            {
                include: [path.resolve(__dirname, 'src')],
                loader: 'babel-loader',
                options: {
                    plugins: ['syntax-dynamic-import'],

                    presets: [
                        [
                            'env',
                            {
                                modules: false
                            }
                        ]
                    ]
                },

                test: /\.js$/
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: 'style-loader',
                        options: {
                            sourceMap: true
                        }
                    },
                    {
                        loader: 'css-loader'
                    }
                ]
            }
        ]
    },

    entry: {
        "codemirror-anywhere.user": "./lib/codemirror-anywhere.user.js"
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist')
    }
};
