import React from 'react';
import Loadable from 'react-loadable';
import { LoadingPlaceholder2 } from '../../components/common/LoadingPlaceholder';

const Loader = () => (
    <div className="container">
        <LoadingPlaceholder2 />
    </div>
);

const AsyncLocation = Loadable({
    loader: () => import(/* webpackChunkName: "locationChunk" */ './Location'),
    loading: Loader,
    modules: ['locationChunk'],
});

export default AsyncLocation;
