const WebpackChain = require('webpack-chain');
const nodeExternals = require('webpack-node-externals');
const {
    resolvePath,
    isDev
} = require('./utils');
const {getBaseConfig} = require('./base.config')

module.exports = {
    getServerConfig: function() {
        const chain = new WebpackChain();
        getBaseConfig(chain, true);
        chain
            .entry('server')
                .add(resolvePath('entry/server-entry.js'))
                .end()
            .output
                .path(resolvePath('dist/server'))
                .filename('[name].js')
                .libraryTarget('commonjs2')
                .end()
            .when(isDev, function(chain) {
                console.log('watch')
                chain.watch(true);
                chain.watchOptions({
                    ignored: /node_modules/,
                    aggregateTimeout: 200,
                    poll: 1000
                });
            })
            .target('node')
            .externals(nodeExternals({
                allowlist: [/\.(css|less|sass|scss)$/]
            }));
        console.log(chain.toConfig());
        return chain.toConfig();
    }
}