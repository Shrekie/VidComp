const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');
const CompressionPlugin = require('compression-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    node: {
    __dirname: true,
    __filename: true,
    },
    devtool: 'source-map',
    entry: [
        './src/vue_app/main.js'
    ],
    output: {
        path: __dirname + '/public',
        filename: 'index_bundle.js',
        publicPath: '/'
    },
    module: {
        noParse: /ffmpeg/,
        rules: [
            {
                test: /\.vue$/,
                use: 'vue-loader'
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                loader: 'file-loader?name=[name].[ext]'
            },    
            {
            test: /\.css$/,
            use: [
                {
                  loader: MiniCssExtractPlugin.loader,
                },
                "css-loader"
              ]
            },
            {
                test: /\.m?js$/,
                exclude: /(node_modules|ffmpeg)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                      presets: ['@babel/preset-env'],
                      plugins: [
                        "@babel/plugin-syntax-dynamic-import",
                        "@babel/plugin-proposal-class-properties"]
                    }
                }
            },
            {
                test: /\.gz$/,
                enforce: 'pre',
                use: 'gzip-loader'
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css"
          }),
        new HtmlWebpackPlugin({
            template: 'src/template/index.html'
        }),
        new CompressionPlugin({test: /\.(js|jsx)$/})
    ]
}