const {
    resolvePath,
    isDev
} = require('./utils')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

exports.getBaseConfig = (chain, isServer) => {
    const mode = process.env.NODE_ENV;
    chain
        .mode(mode)
        .devtool(isDev ? 'eval-source-map': 'source-map')
        .resolve.alias
            .set('root', resolvePath('./'))
            .set('web', resolvePath('./web'))
            .end()
        .extensions
            .add('.jsx')
            .add('...')
            .end()
    chain
        .module
        .rule('babel')
        .test(/\.jsx?$/)
        .exclude
            .add(/node_modules/)
            .end()
        .use('babel-loader')
        .loader('babel-loader')
        .options({
            cacheDirectory: true,
            presets: [
                [
                    '@babel/preset-env'
                ],
                [
                    '@babel/preset-react'
                ]
            ],
            plugins: [
                '@babel/plugin-transform-runtime'
            ]
        })
    chain
        .module
        .rule('css')
        .test(/.css$/)
        .use('MiniCss')
        .loader(MiniCssExtractPlugin.loader)
        .end()
        .use('css')
        .loader('css-loader')
        .end()
    chain
        .plugin('mini-css-extract-plugin')
        .use(MiniCssExtractPlugin, [
            {
                filename: '[name].[contenthash:6].css',
                chunkFilename: '[name].[contenthash:6].chunk.css'
            }
        ])
}