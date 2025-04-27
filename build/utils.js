const path = require('path');
const fs = require('fs-extra')

module.exports = {
    resolvePath (...arg) {
        return path.join(__dirname, '..', ...arg);
    },
    isDev () {
        return process.env.NODE_ENV === 'development';
    },
    isProd () {
        return process.env.NODE_ENV === 'production';
    },
    async cleanDist (distPath) {
        return fs.remove(distPath);
    }
}