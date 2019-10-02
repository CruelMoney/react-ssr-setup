import loadable from '@loadable/component';
const LazyBlog = loadable(() => import('./Blog'));

export default LazyBlog;
