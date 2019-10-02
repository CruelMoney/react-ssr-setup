import React from 'react';
import loadable from '@loadable/component';
import Loading from './LoadingRequestForm';

const LazyUser = loadable(() => import('./RequestForm'), { fallback: <Loading /> });

export default LazyUser;
