import loadable from '@loadable/component';
const LazyUser = loadable(() => import(/* webpackPrefetch: true */ './User'));

export default LazyUser;
