import loadable from '@loadable/component';
const LazyGig = loadable(() => import('./Gig'));

export default LazyGig;
