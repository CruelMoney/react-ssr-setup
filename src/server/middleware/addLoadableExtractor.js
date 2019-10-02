import path from 'path';
import { ChunkExtractor } from '@loadable/server';
import paths from '../../../config/paths';

const statsFile = path.join(paths.clientBuild, paths.publicPath) + 'loadable-stats.json';

const addLoadableExtractor = (_req, res, next) => {
    const extractor = new ChunkExtractor({ statsFile, entrypoints: ['bundle'] });

    res.locals.chunkExtractor = extractor;
    next();
};

export default addLoadableExtractor;
