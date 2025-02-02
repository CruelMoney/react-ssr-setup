import React, { Component } from 'react';
import { withRouter } from 'react-router';
import Navlink from './common/Navlink';

const mapCityName = (name) => {
    if (name === 'koebenhavn') {
        return 'København';
    }
    if (name === 'aarhus') {
        return 'Århus';
    }
    return name;
};

class BreadCrumbs extends Component {
    render() {
        const { location } = this.props;
        const crumbs = location.pathname.split('/');
        const isLocale = crumbs[1] === 'dk';
        const renderCrumbs = crumbs.slice(isLocale ? 3 : 2, crumbs.length);
        const endIdx = isLocale ? 4 : 3;

        return (
            <ol className="breadcrumbs" itemScope itemType="http://schema.org/BreadcrumbList">
                {renderCrumbs.map((crumb, idx) => {
                    return (
                        <li
                            key={`breadcrumb-${idx + 1}`}
                            itemProp="itemListElement"
                            itemScope
                            itemType="http://schema.org/ListItem"
                        >
                            <span>>></span>
                            <Navlink
                                itemScope
                                itemType="http://schema.org/Thing"
                                itemProp="item"
                                to={`${crumbs.slice(0, idx + endIdx).join('/')}`}
                            >
                                <span itemProp="name">{mapCityName(crumb)}</span>
                            </Navlink>
                            <meta itemProp="position" content={idx + 1} />
                        </li>
                    );
                })}
            </ol>
        );
    }
}

export default withRouter(BreadCrumbs);
