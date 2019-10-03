import path from 'path';
import { URL } from 'url';
import redis from 'express-redis-cache';
import paths from '../../../config/paths';

//  REDIS_URL=redis://lolipop:SOME_PASSWORD@dokku-redis-lolipop:6379
let redisUrl = process.env.REDIS_URL;
const options = {};
if (redisUrl) {
    redisUrl = new URL(redisUrl);
    options.host = redisUrl.hostname;
    options.port = redisUrl.port;
    options.auth_pass = redisUrl.password;
}

const cache = redis(options);

if (process.env.NODE_ENV === 'development') {
    cache.on('message', console.log);
}

const addRedis = (app) => {
    console.log('adding redis');

    const disableForLoggedIn = (req, res, next) => {
        // Use only cache if user not signed in
        const xToken = req.cookies['x-token'];
        res.use_express_redis_cache = !xToken;
        next();
    };

    app.get('*', disableForLoggedIn);
    app.get('*', cache.route({ expire: -1 }));
    // expire after 60 seconds
    app.get('/user/*', cache.route({ expire: 60 }));
    app.get('/event/*', cache.route({ expire: 60 }));
    app.get('/gig/*', cache.route({ expire: 60 }));
};

export default addRedis;
export { cache };
