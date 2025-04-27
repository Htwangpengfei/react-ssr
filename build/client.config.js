const WebpackChain = require('webpack-chain');
const webpack = require('webpack');
const {getBaseConfig} = require('./base.config');
const {isDev, resolvePath} = require('./utils');
const {WebpackManifestPlugin} = require('webpack-manifest-plugin');

exports.getClientConfig = () => {
    const distPath = 'dist/client'
    const outputPath = resolvePath(distPath);
    const chain = new WebpackChain()
    getBaseConfig(chain, false)
    chain.entry('client-entry')
        .when(isDev, entry => {
            entry
                .add('webpack-hot-middleware/client')
                .add(resolvePath('entry/client-entry'))
        }, entry => {
            entry
                .add(resolvePath('entry/client-entry'))
        })
        .end()
    .output
        .path(outputPath)
        .publicPath('/')
        .filename('[name].[contenthash:6].js')
        .end()
    .plugin('manifest')
        .use(WebpackManifestPlugin)
        .end()
    .plugin('HotModuleReplacementPlugin')
        .use(webpack.HotModuleReplacementPlugin)
        .end()

    return chain.toConfig()
}