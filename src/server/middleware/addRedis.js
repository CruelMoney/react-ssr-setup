import path from 'path';
import url from 'url';
import redis from 'express-redis-cache';
import paths from '../../../config/paths';

//  REDIS_URL=redis://lolipop:SOME_PASSWORD@dokku-redis-lolipop:6379
let redisUrl = process.env.REDIS_URL;
const options = {
    expire: 60, // seconds
};
if (redisUrl) {
    redisUrl = url.parse(redisUrl);
    options.host = redisUrl.host;
    options.port = redisUrl.port;
    options.auth_pass = redisUrl.password;
}
const cache = redis(options);

const addRedis = (req, res, next) => {
    cache.route()(req, res, next);
};

export default addRedis;
export { cache };
