import * as React from 'react';
import * as express from 'express';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { Store } from 'redux';
import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';
import { getDataFromTree } from '@apollo/react-ssr';
import { ServerStyleSheet, StyleSheetManager } from 'styled-components';
import { ApolloProvider } from 'react-apollo';
import App from '../../shared/App';
import Html from '../components/HTML';

const MuiThemeProvider = require('material-ui/styles/MuiThemeProvider').default;
const getMuiTheme = require('material-ui/styles/getMuiTheme').default;

const serverRenderer = () => async (req, res) => {
    const sheet = new ServerStyleSheet();

    const routerContext = {};
    const helmetContext = {};

    const theme = getMuiTheme({
        userAgent: req.headers['user-agent'],
    });

    const Content = (
        <ApolloProvider client={res.locals.apolloClient}>
            <StyleSheetManager sheet={sheet.instance}>
                <Provider store={res.locals.store}>
                    <StaticRouter location={req.url} context={routerContext}>
                        <MuiThemeProvider muiTheme={theme}>
                            <HelmetProvider context={helmetContext}>
                                <App />
                            </HelmetProvider>
                        </MuiThemeProvider>
                    </StaticRouter>
                </Provider>
            </StyleSheetManager>
        </ApolloProvider>
    );

    const apolloState = {};
    // try {
    //     await getDataFromTree(Content);
    //     apolloState = res.locals.apolloClient.extract();
    // } catch (error) {
    //     console.log({ error });
    // }

    const content = renderToString(Content);
    const styleTags = sheet.getStyleElement();
    sheet.seal();

    const state = JSON.stringify(res.locals.store.getState());
    const css = [res.locals.assetPath('bundle.css'), res.locals.assetPath('vendor.css')];

    console.log({ css });
    return res.send(
        '<!doctype html>' +
            renderToString(
                <Html
                    helmetContext={helmetContext}
                    state={state}
                    apolloState={JSON.stringify(apolloState)}
                    headerChildren={styleTags}
                    myCss={css}
                    scripts={[res.locals.assetPath('bundle.js'), res.locals.assetPath('vendor.js')]}
                >
                    {content}
                </Html>
            )
    );
};

export default serverRenderer;
