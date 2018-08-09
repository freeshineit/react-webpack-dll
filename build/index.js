const path = require('path');
const fs = require('fs');
const shell = require('shelljs');
const config = require('./config');
const prodConfig = require('./webpack.prod.config.js');

const manifestPath = path.join(__dirname, '../dist/manifest.json');

const start = async () => {
    let _manifest = {};
    if (fs.existsSync(manifestPath)) {
        _manifest = fs.readFileSync(manifestPath);
        if (_manifest) {
            _manifest = JSON.parse(_manifest);
        }
    }
    if (!_manifest[`${config.pro.vendor}.js`]) { // 没有执行dll
        await shell.exec(`npm run dll`);
    }
    
    await shell.exec(`webpack -p --mode production --progress --config build/webpack.prod.config.js`);
}

start();