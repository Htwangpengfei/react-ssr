const path = require('path');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const {getClientConfig} = require('./client.config');
const {getServerConfig} = require('./server.config');
const {cleanDist} = require('./utils');

exports.startClientServer = async (app) => {
    // 启动之前删除之前编译的代码
    await cleanDist(path.join(__dirname, '../dist'));
    const config = getClientConfig();
    const compile = webpack(config);
    // 使用webpackDevMiddleware
    app.use(webpackDevMiddleware(
        compile, {
            publicPath: config.output.publicPath,
            writeToDisk: true
        }
    ))
    // 热重载
    .use(webpackHotMiddleware(compile))
}

exports.startServerBuild = () => {
    return new Promise((resolve, reject) => {
        webpack(getServerConfig(), (err, stats) => {
            if (err || stats.hasErrors()) {
                console.log(err || stats.toString());
                reject();
            } else {
                resolve();
            }
        })
    })
}
