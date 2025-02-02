const path = require('path');
const fs = require('fs');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);

const paths = {
    appHtml: resolveApp('config/webpack.config.js/template.html'),
    clientBuild: resolveApp('build/client'),
    serverBuild: resolveApp('build/server'),
    dotenv: resolveApp('.env'),
    src: resolveApp('src'),
    srcClient: resolveApp('src/client'),
    srcServer: resolveApp('src/server'),
    srcShared: resolveApp('src/shared'),
    types: resolveApp('node_modules/@types'),
    locales: resolveApp('src/shared/i18n/locales'),
    publicPath: '/static/',
    publicDev: resolveApp('public'),
};

paths.resolveModules = [
    'node_modules',
    paths.srcClient,
    paths.srcServer,
    paths.srcShared,
    paths.src,
];

module.exports = paths;
