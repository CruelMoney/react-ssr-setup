module.exports = {
    apps: [
        {
            name: 'Cueup Frontend',
            script: 'build/server/server.js',

            // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
            instances: 1,
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

    deploy: {
        production: {
            'user': 'node',
            'host': '212.83.163.1',
            'ref': 'origin/master',
            'repo': 'git@github.com:repo.git',
            'path': '/var/www/production',
            'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production',
        },
    },
};
