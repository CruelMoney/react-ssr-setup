import React from 'react';
import loadable from '@loadable/component';
import { LoadingPlaceholder2 } from '../../components/common/LoadingPlaceholder';

const Loader = () => (
    <div className="container">
        <LoadingPlaceholder2 />
    </div>
);

const AsyncTerms = loadable(() => import('./Terms'), {
    fallback: <Loader />,
});

export default AsyncTerms;
