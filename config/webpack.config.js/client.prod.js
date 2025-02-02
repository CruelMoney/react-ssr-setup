const CopyPlugin = require('copy-webpack-plugin');
const paths = require('../paths');
const baseConfig = require('./client.base');
const generateSourceMap = process.env.OMIT_SOURCEMAP === 'true' ? false : true;

const config = {
    ...baseConfig,
    optimization: {
        ...baseConfig.optimization,
        minimize: true,
    },
    plugins: [
        // copy public folder to build
        new CopyPlugin([
            {
                from: paths.publicDev,
                to: paths.clientBuild,
            },
        ]),
        ...baseConfig.plugins,
    ],
    mode: 'production',
    devtool: generateSourceMap ? 'source-map' : false,
};

config.output.filename = 'bundle.[hash:8].js';

module.exports = config;
