import loadable from '@loadable/component';
const LazyEvent = loadable(() => import('./Event'));

export default LazyEvent;
