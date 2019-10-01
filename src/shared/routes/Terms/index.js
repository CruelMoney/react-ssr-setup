import React from 'react';
import Loadable from 'react-loadable';
import { LoadingPlaceholder2 } from '../../components/common/LoadingPlaceholder';

const Loader = () => (
    <div className="container">
        <LoadingPlaceholder2 />
    </div>
);

const AsyncTerms = Loadable({
    loader: () => import(/* webpackChunkName: "termsChunk" */ './Terms'),
    loading: Loader,
    modules: ['termsChunk'],
});

export default AsyncTerms;
