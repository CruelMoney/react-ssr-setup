import loadable from '@loadable/component';
const LazySignup = loadable(() => import('./Signup'));

export default LazySignup;
