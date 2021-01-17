const fs = require('fs')
const path = require('path');
const miniCss = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const PATHS = {
    src: path.join(__dirname, 'src'),
}
const PAGES_DIR = `${PATHS.src}/pug/pages/`
const PAGES = fs.readdirSync(PAGES_DIR).filter(fileName => fileName.endsWith('.pug'))

module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    devtool: 'inline-source-map',
    devServer: {
        index: 'index.html',
        contentBase: path.join(__dirname, 'dist'),
        hot: true,
        writeToDisk: true,
        open: 'chrome',
        compress: true,
        port: 8888
    },
    module: {
        rules: [
            {
                test: /\.pug$/,
                loader: 'pug-loader',
                options: {pretty: true},
                exclude: '/node_modules/',
            },
            {
                test:/\.(s*)css$/,
                use: [
                    miniCss.loader,
                    'css-loader',
                    'sass-loader',
                ]
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg|otf)(\?v=\d+\.\d+\.\d+)?$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'fonts/'
                    },
                }]
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'images/'
                    }
                }]
            }
        ]
    },
    plugins: [
    new CleanWebpackPlugin(),
    new miniCss({
        filename: 'css/style.css',
    }),
    ...PAGES.map(page => new HtmlWebpackPlugin ({
        template: `${PAGES_DIR}/${page}`,
        filename: `./${page.replace(/\.pug/,'.html')}`
    })),
    new CopyWebpackPlugin({
        patterns: [
            {
                from: 'src/assets/fonts',
                to: 'fonts'
            },
            {
                from: 'src/assets/images',
                to: 'images'
            },
        ],
    })
   ]
};