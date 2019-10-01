import React from 'react';
import { hydrate, render } from 'react-dom';
import * as Sentry from '@sentry/browser';
import Loadable from 'react-loadable';
import Router from './BrowserRouter';

const production = process.env.NODE_ENV === 'production';

if (production) {
    console.log('Initializing Sentry');
    Sentry.init({
        enabled: production,
        dsn: 'https://800ac4dbef6c44bcb65af9fddad9f964@sentry.io/1490082',
        environment: process.env.REACT_APP_CUEUP_DEV_CALLBACK_DOMAIN,
    });
}

// import registerServiceWorker from "./utils/ServiceWorker";

const rootElement = document.getElementById('app');
if (rootElement && rootElement.hasChildNodes()) {
    console.log('hydrating');
    Loadable.preloadReady().then(() => {
        hydrate(<Router />, rootElement);
    });
} else {
    render(<Router />, rootElement);
}

// registerServiceWorker();
