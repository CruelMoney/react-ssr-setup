// Import the individual autotrack plugins you want to use.

/* global ga */

/**
 * The tracking ID for your Google Analytics property.
 * https://support.google.com/analytics/answer/1032385
 */
const TRACKING_ID = 'UA-59876038-4';

const OPTIMIZE_ID = 'GTM-KW2PT4L';

/**
 * Bump this when making backwards incompatible changes to the tracking
 * implementation. This allows you to create a segment or view filter
 * that isolates only data captured with the most recent tracking changes.
 */
const TRACKING_VERSION = '1';

/**
 * A default value for dimensions so unset values always are reported as
 * something. This is needed since Google Analytics will drop empty dimension
 * values in reports.
 */
const NULL_VALUE = '(not set)';

/**
 * A maping between custom dimension names and their indexes.
 */
const dimensions = {
    TRACKING_VERSION: 'dimension1',
    CLIENT_ID: 'dimension2',
    WINDOW_ID: 'dimension3',
    HIT_ID: 'dimension4',
    HIT_TIME: 'dimension5',
    HIT_TYPE: 'dimension6',
    HIT_SOURCE: 'dimension7',
    VISIBILITY_STATE: 'dimension8',
    URL_QUERY_PARAMS: 'dimension9',
};

/**
 * A maping between custom dimension names and their indexes.
 */
const metrics = {
    RESPONSE_END_TIME: 'metric1',
    DOM_LOAD_TIME: 'metric2',
    WINDOW_LOAD_TIME: 'metric3',
    PAGE_VISIBLE: 'metric4',
    MAX_SCROLL_PERCENTAGE: 'metric5',
};

/**
 * Initializes all the analytics setup. Creates trackers and sets initial
 * values on the trackers.
 */
export const init = () => {
    // Initialize the command queue in case analytics.js hasn't loaded yet.
    window.ga = window.ga || ((...args) => (ga.q = ga.q || []).push(args));

    createTracker();
    trackErrors();
    trackCustomDimensions();
    requireAutotrackPlugins();
    sendInitialPageview();
    sendNavigationTimingMetrics();
    trackHashChange();
};

/**
 * Tracks a JavaScript error with optional fields object overrides.
 * This function is exported so it can be used in other parts of the codebase.
 * E.g.:
 *
 *    `fetch('/api.json').catch(trackError);`
 *
 * @param {Error|undefined} error
 * @param {Object=} fieldsObj
 */
export const trackError = (error, fieldsObj = {}) => {
    ga(
        'send',
        'event',
        Object.assign(
            {
                eventCategory: 'Script',
                eventAction: 'error',
                eventLabel: (error && error.stack) || NULL_VALUE,
                nonInteraction: true,
            },
            fieldsObj
        )
    );
};

export function trackCheckAvailability() {
    ga('send', 'event', {
        eventCategory: 'Event',
        eventAction: 'checkavailability',
    });
}
export function trackSignup() {
    ga('send', 'event', {
        eventCategory: 'Account',
        eventAction: 'created',
    });
}
export function trackEventPosted() {
    ga('send', 'event', {
        eventCategory: 'Event',
        eventAction: 'created',
    });
}
export function trackEventPaid(val) {
    ga('send', 'event', {
        eventCategory: 'Event',
        eventAction: 'paid',
        eventValue: val,
    });
}

/**
 * Creates the trackers and sets the default transport and tracking
 * version fields. In non-production environments it also logs hits.
 */
const createTracker = () => {
    ga('create', TRACKING_ID, 'auto');

    // Google optimize
    ga('require', OPTIMIZE_ID);

    // Ensures all hits are sent via `navigator.sendBeacon()`.
    ga('set', 'transport', 'beacon');
};

/**
 * Tracks any errors that may have occured on the page prior to analytics being
 * initialized, then adds an event handler to track future errors.
 */
const trackErrors = () => {
    // Errors that have occurred prior to this script running are stored on
    // `window.__e.q`, as specified in `index.html`.
    const loadErrorEvents = (window.__e && window.__e.q) || [];

    // Use a different eventAction for uncaught errors.
    const fieldsObj = { eventAction: 'uncaught error' };

    // Replay any stored load error events.
    for (const event of loadErrorEvents) {
        trackError(event.error, fieldsObj);
    }

    // Add a new listener to track event immediately.
    window.addEventListener('error', (event) => {
        trackError(event.error, fieldsObj);
    });
};

/**
 * Sets a default dimension value for all custom dimensions on all trackers.
 */
const trackCustomDimensions = () => {
    // Sets a default dimension value for all custom dimensions to ensure
    // that every dimension in every hit has *some* value. This is necessary
    // because Google Analytics will drop rows with empty dimension values
    // in your reports.
    Object.keys(dimensions).forEach((key) => {
        ga('set', dimensions[key], NULL_VALUE);
    });

    // Adds tracking of dimensions known at page load time.
    ga((tracker) => {
        tracker.set({
            [dimensions.TRACKING_VERSION]: TRACKING_VERSION,
            [dimensions.CLIENT_ID]: tracker.get('clientId'),
            [dimensions.WINDOW_ID]: uuid(),
        });
    });

    // Adds tracking to record each the type, time, uuid, and visibility state
    // of each hit immediately before it's sent.
    ga((tracker) => {
        const originalBuildHitTask = tracker.get('buildHitTask');
        tracker.set('buildHitTask', (model) => {
            model.set(dimensions.HIT_ID, uuid(), true);
            model.set(dimensions.HIT_TIME, String(Number(new Date())), true);
            model.set(dimensions.HIT_TYPE, model.get('hitType'), true);
            model.set(dimensions.VISIBILITY_STATE, document.visibilityState, true);

            originalBuildHitTask(model);
        });
    });
};

/**
 * Requires select autotrack plugins and initializes each one with its
 * respective configuration options.
 */
const requireAutotrackPlugins = () => {
    /*  ga('require', 'cleanUrlTracker', {
    stripQuery: false,
    queryDimensionIndex: getDefinitionIndex(dimensions.URL_QUERY_PARAMS),
    trailingSlash: 'remove',
  });*/
    ga('require', 'maxScrollTracker', {
        sessionTimeout: 30,
        timeZone: 'America/Los_Angeles',
        maxScrollMetricIndex: getDefinitionIndex(metrics.MAX_SCROLL_PERCENTAGE),
    });
    ga('require', 'outboundLinkTracker', {
        events: ['click', 'contextmenu'],
    });
    ga('require', 'pageVisibilityTracker', {
        visibleMetricIndex: getDefinitionIndex(metrics.PAGE_VISIBLE),
        sessionTimeout: 30,
        timeZone: 'America/Los_Angeles',
        fieldsObj: { [dimensions.HIT_SOURCE]: 'pageVisibilityTracker' },
    });
    ga('require', 'urlChangeTracker', {
        fieldsObj: { [dimensions.HIT_SOURCE]: 'urlChangeTracker' },
    });
};

/**
 * Sends the initial pageview to Google Analytics.
 */
const sendInitialPageview = () => {
    ga('send', 'pageview', { [dimensions.HIT_SOURCE]: 'pageload' });
};

/**
 * Gets the DOM and window load times and sends them as custom metrics to
 * Google Analytics via an event hit.
 */
const sendNavigationTimingMetrics = () => {
    // Only track performance in supporting browsers.
    if (!(window.performance && window.performance.timing)) {
        return;
    }

    // If the window hasn't loaded, run this function after the `load` event.
    if (document.readyState !== 'complete') {
        window.addEventListener('load', sendNavigationTimingMetrics);
        return;
    }

    const nt = performance.timing;
    const navStart = nt.navigationStart;

    const responseEnd = Math.round(nt.responseEnd - navStart);
    const domLoaded = Math.round(nt.domContentLoadedEventStart - navStart);
    const windowLoaded = Math.round(nt.loadEventStart - navStart);

    // In some edge cases browsers return very obviously incorrect NT values,
    // e.g. 0, negative, or future times. This validates values before sending.
    const allValuesAreValid = (...values) => {
        return values.every((value) => value > 0 && value < 6e6);
    };

    if (allValuesAreValid(responseEnd, domLoaded, windowLoaded)) {
        ga('send', 'event', {
            eventCategory: 'Navigation Timing',
            eventAction: 'track',
            nonInteraction: true,
            [metrics.RESPONSE_END_TIME]: responseEnd,
            [metrics.DOM_LOAD_TIME]: domLoaded,
            [metrics.WINDOW_LOAD_TIME]: windowLoaded,
        });
    }
};

/**
 * Accepts a custom dimension or metric and returns it's numerical index.
 * @param {string} definition The definition string (e.g. 'dimension1').
 * @return {number} The definition index.
 */
const getDefinitionIndex = (definition) => Number(/\d+$/.exec(definition)[0]);

/**
 * Generates a UUID.
 * https://gist.github.com/jed/982883
 * @param {string|undefined=} a
 * @return {string}
 */
const uuid = function b(a) {
    return a
        ? ((a ^ (Math.random() * 16)) >> (a / 4)).toString(16)
        : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, b);
};

const trackHashChange = () => {
    window.addEventListener('hashchange', (event) => {
        const newPath =
            document.location.pathname + document.location.search + document.location.hash;
        ga('send', 'pageview', { page: newPath });
    });
};
