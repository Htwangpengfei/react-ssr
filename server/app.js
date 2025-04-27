const express = require('express');
const path = require('path');
const fs = require('fs-extra');
const {startClientServer, startServerBuild} = require('../build/start');

const app = express();
const PORT = 3000;
const serverBundlePath = path.join(__dirname, '../dist/server/server.js');
const clientManifestPath = path.join(__dirname, '../dist/client/manifest.json');
app.get('/', async (req, res) => {
    res.send(await parseRoute(req.url));
})
app.get('/about', async(req, res) => {
    res.send(await parseRoute(req.url));
})

async function parseRoute (url) {
    const {serverRender} = require(serverBundlePath);
    const clientManifest = require(clientManifestPath);
    if (process.env.NODE_ENV === 'development') {
        // 开发环境下，web端改变的时候，serverBundle也会改变。require的加载机制是第一次加载，后面就取缓存，所以删除缓存，每次加载最新
        delete require.cache[serverBundlePath]
        delete require.cache[clientManifestPath]
    }
    const {content, state} = await serverRender(url);
    const html = `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="stylesheet" href="${clientManifest['client-entry.css']}">
            <title>Document</title>
        </head>
        <body>
            <div id="app">${content}</div>
        </body>
        <script>
            window.__INIT_STATE__=${JSON.stringify(state)}
        </script>
        <script src="${clientManifest['client-entry.js']}"></script>
        </html>
    `
    return html;
}

// app.use(express.static(path.join(__dirname, '../dist/client')));

async function bootstrap () {
    await Promise.all([startClientServer(app), startServerBuild()]);
    app.listen(PORT, () => {
        console.log('server running~~')
    })
}

bootstrap();