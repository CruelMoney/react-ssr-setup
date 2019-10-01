import React, { Component } from 'react';
import addTranslate from '../../components/higher-order/addTranslate';
import ScrollToTop from '../../components/common/ScrollToTop';
import Home from './components/Home';
import content from './content.json';

class Index extends Component {
    render() {
        return (
            <>
                <Home {...this.props} />
                <ScrollToTop />
            </>
        );
    }
}

export default addTranslate(Index, content);
