module.exports = {
    apps: [
        {
            name: 'Cueup Frontend',
            script: 'build/server/server.js',

            // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
            instances: 'max',
            exec_mode: 'cluster',
            autorestart: true,
            watch: false,
            max_memory_restart: '1G',
            env: {
                NODE_ENV: 'development',
            },
            env_production: {
                PORT: 3000,
                NODE_ENV: 'production',
            },
        },
    ],
};
