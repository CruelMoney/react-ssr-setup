import { ApolloLink } from 'apollo-link';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import fetch from 'node-fetch';
import resolvers from '../../shared/actions/resolvers';

const addApollo = (_req, res, next) => {
    console.log('Setting up apollo for: ', process.env.REACT_APP_CUEUP_GQL_DOMAIN);

    const httpLink = createHttpLink({
        fetch: fetch,
        uri: process.env.REACT_APP_CUEUP_GQL_DOMAIN,
        credentials: 'include',
        headers: {
            'x-token': _req.cookies['x-token'], // forward token
            'origin': process.env.WEBSITE_URL,
        },
    });

    const link = ApolloLink.from([errorLink, httpLink]);

    const apolloClient = new ApolloClient({
        ssrMode: true,
        link,
        cache: new InMemoryCache(),
        resolvers,
    });

    res.locals.apolloClient = apolloClient;

    next();
};

// Ignore errors
const errorLink = onError(({ graphQLErrors, networkError, response, operation, forward }) => {
    console.log({ graphQLErrors });
    return forward(operation);
});

export default addApollo;
