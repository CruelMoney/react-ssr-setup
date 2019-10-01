import React, { Component } from 'react';
import * as Sentry from '@sentry/browser';
import EmptyPage from './EmptyPage';

export default class ErrorPage extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    componentDidCatch(error, info) {
        // Display fallback UI
        Sentry.captureException(error);
        console.log({ error, info });
        this.setState({ hasError: true });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="error-screen">
                    <EmptyPage
                        title={'Something went wrong'}
                        message={
                            <span>
                                Sorry, something went wrong.
                                <br />
                                Try reloading the page or go back.
                                <br />
                                <a style={{ marginTop: '20px' }} className="button" href="/">
                                    GO BACK
                                </a>
                            </span>
                        }
                    />
                </div>
            );
        }
        return this.props.children;
    }
}
