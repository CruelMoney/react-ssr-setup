(function() {
    var f,
        aa =
            'function' == typeof Object.defineProperties
                ? Object.defineProperty
                : function(a, b, c) {
                      if (c.get || c.set)
                          throw new TypeError('ES3 does not support getters and setters.');
                      a != Array.prototype && a != Object.prototype && (a[b] = c.value);
                  },
        k =
            'undefined' != typeof window && window === this
                ? this
                : 'undefined' != typeof global && null != global
                ? global
                : this;
    function l() {
        l = function() {};
        k.Symbol || (k.Symbol = ba);
    }
    var ca = 0;
    function ba(a) {
        return 'jscomp_symbol_' + (a || '') + ca++;
    }
    function m() {
        l();
        var a = k.Symbol.iterator;
        a || (a = k.Symbol.iterator = k.Symbol('iterator'));
        'function' != typeof Array.prototype[a] &&
            aa(Array.prototype, a, {
                configurable: !0,
                writable: !0,
                value: function() {
                    return da(this);
                },
            });
        m = function() {};
    }
    function da(a) {
        var b = 0;
        return ea(function() {
            return b < a.length ? { done: !1, value: a[b++] } : { done: !0 };
        });
    }
    function ea(a) {
        m();
        a = { next: a };
        a[k.Symbol.iterator] = function() {
            return this;
        };
        return a;
    }
    function n(a) {
        if (!(a instanceof Array)) {
            m();
            var b = a[Symbol.iterator];
            a = b ? b.call(a) : da(a);
            for (var c = []; !(b = a.next()).done; ) c.push(b.value);
            a = c;
        }
        return a;
    }
    function fa(a, b) {
        function c() {}
        c.prototype = b.prototype;
        a.prototype = new c();
        a.prototype.constructor = a;
        for (var d in b)
            if (Object.defineProperties) {
                var e = Object.getOwnPropertyDescriptor(b, d);
                e && Object.defineProperty(a, d, e);
            } else a[d] = b[d];
    }
    var p = window.Element.prototype,
        ha =
            p.matches ||
            p.matchesSelector ||
            p.webkitMatchesSelector ||
            p.mozMatchesSelector ||
            p.msMatchesSelector ||
            p.oMatchesSelector;
    function ia(a, b) {
        if (a && 1 == a.nodeType && b) {
            if ('string' == typeof b || 1 == b.nodeType) return a == b || ja(a, b);
            if ('length' in b)
                for (var c = 0, d; (d = b[c]); c++) if (a == d || ja(a, d)) return !0;
        }
        return !1;
    }
    function ja(a, b) {
        if ('string' != typeof b) return !1;
        if (ha) return ha.call(a, b);
        b = a.parentNode.querySelectorAll(b);
        for (var c = 0, d; (d = b[c]); c++) if (d == a) return !0;
        return !1;
    }
    function ka(a) {
        for (var b = []; a && a.parentNode && 1 == a.parentNode.nodeType; )
            (a = a.parentNode), b.push(a);
        return b;
    }
    function q(a, b, c) {
        function d(a) {
            var d;
            if (g.composed && 'function' == typeof a.composedPath)
                for (var e = a.composedPath(), h = 0, E; (E = e[h]); h++)
                    1 == E.nodeType && ia(E, b) && (d = E);
            else
                a: {
                    if ((d = a.target) && 1 == d.nodeType && b)
                        for (d = [d].concat(ka(d)), e = 0; (h = d[e]); e++)
                            if (ia(h, b)) {
                                d = h;
                                break a;
                            }
                    d = void 0;
                }
            d && c.call(d, a, d);
        }
        var e = document,
            g = { composed: !0, P: !0 },
            g = void 0 === g ? {} : g;
        e.addEventListener(a, d, g.P);
        return {
            j: function() {
                e.removeEventListener(a, d, g.P);
            },
        };
    }
    function la(a) {
        var b = {};
        if (!a || 1 != a.nodeType) return b;
        a = a.attributes;
        if (!a.length) return {};
        for (var c = 0, d; (d = a[c]); c++) b[d.name] = d.value;
        return b;
    }
    var ma = /:(80|443)$/,
        r = document.createElement('a'),
        t = {};
    function u(a) {
        a = a && '.' != a ? a : location.href;
        if (t[a]) return t[a];
        r.href = a;
        if ('.' == a.charAt(0) || '/' == a.charAt(0)) return u(r.href);
        var b = '80' == r.port || '443' == r.port ? '' : r.port,
            b = '0' == b ? '' : b,
            c = r.host.replace(ma, '');
        return (t[a] = {
            hash: r.hash,
            host: c,
            hostname: r.hostname,
            href: r.href,
            origin: r.origin ? r.origin : r.protocol + '//' + c,
            pathname: '/' == r.pathname.charAt(0) ? r.pathname : '/' + r.pathname,
            port: b,
            protocol: r.protocol,
            search: r.search,
        });
    }
    var v = [];
    function na(a, b) {
        var c = this;
        this.context = a;
        this.N = b;
        this.f = (this.c = /Task$/.test(b)) ? a.get(b) : a[b];
        this.b = [];
        this.a = [];
        this.i = function(a) {
            for (var b = [], d = 0; d < arguments.length; ++d) b[d - 0] = arguments[d];
            return c.a[c.a.length - 1].apply(null, [].concat(n(b)));
        };
        this.c ? a.set(b, this.i) : (a[b] = this.i);
    }
    function w(a, b) {
        a.b.push(b);
        oa(a);
    }
    function x(a, b) {
        b = a.b.indexOf(b);
        -1 < b && (a.b.splice(b, 1), 0 < a.b.length ? oa(a) : a.j());
    }
    function oa(a) {
        a.a = [];
        for (var b, c = 0; (b = a.b[c]); c++) {
            var d = a.a[c - 1] || a.f.bind(a.context);
            a.a.push(b(d));
        }
    }
    na.prototype.j = function() {
        var a = v.indexOf(this);
        -1 < a &&
            (v.splice(a, 1),
            this.c ? this.context.set(this.N, this.f) : (this.context[this.N] = this.f));
    };
    function y(a, b) {
        var c = v.filter(function(c) {
            return c.context == a && c.N == b;
        })[0];
        c || ((c = new na(a, b)), v.push(c));
        return c;
    }
    function z(a, b, c, d, e) {
        if ('function' == typeof d) {
            var g = c.get('buildHitTask');
            return {
                buildHitTask: function(c) {
                    c.set(a, null, !0);
                    c.set(b, null, !0);
                    d(c, e);
                    g(c);
                },
            };
        }
        return A({}, a, b);
    }
    function B(a, b) {
        var c = la(a),
            d = {};
        Object.keys(c).forEach(function(a) {
            if (!a.indexOf(b) && a != b + 'on') {
                var e = c[a];
                'true' == e && (e = !0);
                'false' == e && (e = !1);
                a = pa(a.slice(b.length));
                d[a] = e;
            }
        });
        return d;
    }
    function qa(a) {
        'loading' == document.readyState
            ? document.addEventListener('DOMContentLoaded', function c() {
                  document.removeEventListener('DOMContentLoaded', c);
                  a();
              })
            : a();
    }
    function ra(a, b) {
        var c;
        return function(d) {
            for (var e = [], g = 0; g < arguments.length; ++g) e[g - 0] = arguments[g];
            clearTimeout(c);
            c = setTimeout(function() {
                return a.apply(null, [].concat(n(e)));
            }, b);
        };
    }
    function sa(a) {
        function b() {
            c || ((c = !0), a());
        }
        var c = !1;
        setTimeout(b, 2e3);
        return b;
    }
    var A =
        Object.assign ||
        function(a, b) {
            for (var c = [], d = 1; d < arguments.length; ++d) c[d - 1] = arguments[d];
            for (var e = 0; (d = c[e]); e++)
                for (var g in d) Object.prototype.hasOwnProperty.call(d, g) && (a[g] = d[g]);
            return a;
        };
    function pa(a) {
        return a.replace(/[\-\_]+(\w?)/g, function(a, c) {
            return c.toUpperCase();
        });
    }
    function C(a) {
        return 'object' == typeof a && null !== a;
    }
    function F(a, b) {
        var c = window.GoogleAnalyticsObject || 'ga';
        window[c] =
            window[c] ||
            function(a) {
                for (var b = [], d = 0; d < arguments.length; ++d) b[d - 0] = arguments[d];
                (window[c].q = window[c].q || []).push(b);
            };
        window.gaDevIds = window.gaDevIds || [];
        0 > window.gaDevIds.indexOf('i5iSjo') && window.gaDevIds.push('i5iSjo');
        window[c]('provide', a, b);
        window.gaplugins = window.gaplugins || {};
        window.gaplugins[a.charAt(0).toUpperCase() + a.slice(1)] = b;
    }
    var G = { R: 1, S: 2, T: 3, V: 4, W: 5, X: 6, Y: 7, Z: 8, $: 9, U: 10 },
        H = Object.keys(G).length;
    function I(a, b) {
        a.set('\x26_av', '2.0.1');
        var c = a.get('\x26_au'),
            c = parseInt(c || '0', 16).toString(2);
        if (c.length < H) for (var d = H - c.length; d; ) (c = '0' + c), d--;
        b = H - b;
        c = c.substr(0, b) + 1 + c.substr(b + 1);
        a.set('\x26_au', parseInt(c || '0', 2).toString(16));
    }
    function J(a, b) {
        I(a, G.R);
        this.a = A({}, b);
        this.i = a;
        this.b =
            this.a.stripQuery && this.a.queryDimensionIndex
                ? 'dimension' + this.a.queryDimensionIndex
                : null;
        this.f = this.f.bind(this);
        this.c = this.c.bind(this);
        b = this.f;
        w(y(a, 'get'), b);
        b = this.c;
        w(y(a, 'buildHitTask'), b);
    }
    J.prototype.f = function(a) {
        var b = this;
        return function(c) {
            if ('page' == c || c == b.b) {
                var d = { location: a('location'), page: a('page') };
                return ta(b, d)[c];
            }
            return a(c);
        };
    };
    J.prototype.c = function(a) {
        var b = this;
        return function(c) {
            var d = ta(b, { location: c.get('location'), page: c.get('page') });
            c.set(d, null, !0);
            a(c);
        };
    };
    function ta(a, b) {
        var c = u(b.page || b.location),
            d = c.pathname;
        if (a.a.indexFilename) {
            var e = d.split('/');
            a.a.indexFilename == e[e.length - 1] && ((e[e.length - 1] = ''), (d = e.join('/')));
        }
        'remove' == a.a.trailingSlash
            ? (d = d.replace(/\/+$/, ''))
            : 'add' == a.a.trailingSlash && (/\.\w+$/.test(d) || '/' == d.substr(-1) || (d += '/'));
        d = { page: d + (a.a.stripQuery ? '' : c.search) };
        b.location && (d.location = b.location);
        a.b && (d[a.b] = c.search.slice(1) || '(not set)');
        return 'function' == typeof a.a.urlFieldsFilter
            ? ((b = a.a.urlFieldsFilter(d, u)),
              (c = {}),
              (c.page = b.page),
              (c.location = b.location),
              (c[a.b] = b[a.b]),
              c)
            : d;
    }
    J.prototype.remove = function() {
        var a = this.f;
        x(y(this.i, 'get'), a);
        a = this.c;
        x(y(this.i, 'buildHitTask'), a);
    };
    F('cleanUrlTracker', J);
    function K(a, b) {
        var c = this;
        I(a, G.S);
        if (window.addEventListener) {
            this.a = A({ events: ['click'], fieldsObj: {}, attributePrefix: 'ga-' }, b);
            this.f = a;
            this.c = this.c.bind(this);
            var d = '[' + this.a.attributePrefix + 'on]';
            this.b = {};
            this.a.events.forEach(function(a) {
                c.b[a] = q(a, d, c.c);
            });
        }
    }
    K.prototype.c = function(a, b) {
        var c = this.a.attributePrefix;
        a.type == b.getAttribute(c + 'on') &&
            ((a = B(b, c)),
            (c = A({}, this.a.fieldsObj, a)),
            this.f.send(
                a.hitType || 'event',
                z({ transport: 'beacon' }, c, this.f, this.a.hitFilter, b)
            ));
    };
    K.prototype.remove = function() {
        var a = this;
        Object.keys(this.b).forEach(function(b) {
            a.b[b].j();
        });
    };
    F('eventTracker', K);
    function ua(a, b) {
        var c = this;
        I(a, G.T);
        window.IntersectionObserver &&
            window.MutationObserver &&
            ((this.a = A({ rootMargin: '0px', fieldsObj: {}, attributePrefix: 'ga-' }, b)),
            (this.c = a),
            (this.K = this.K.bind(this)),
            (this.M = this.M.bind(this)),
            (this.I = this.I.bind(this)),
            (this.J = this.J.bind(this)),
            (this.b = null),
            (this.items = []),
            (this.h = {}),
            (this.g = {}),
            qa(function() {
                return c.observeElements(c.a.elements);
            }));
    }
    f = ua.prototype;
    f.observeElements = function(a) {
        var b = this;
        a = L(this, a);
        this.items = this.items.concat(a.items);
        this.h = A({}, a.h, this.h);
        this.g = A({}, a.g, this.g);
        a.items.forEach(function(a) {
            var c = (b.g[a.threshold] =
                b.g[a.threshold] ||
                new IntersectionObserver(b.M, {
                    rootMargin: b.a.rootMargin,
                    threshold: [+a.threshold],
                }));
            (a = b.h[a.id] || (b.h[a.id] = document.getElementById(a.id))) && c.observe(a);
        });
        this.b ||
            ((this.b = new MutationObserver(this.K)),
            this.b.observe(document.body, { childList: !0, subtree: !0 }));
        requestAnimationFrame(function() {});
    };
    f.unobserveElements = function(a) {
        var b = [],
            c = [];
        this.items.forEach(function(d) {
            a.some(function(a) {
                a = va(a);
                return (
                    a.id === d.id &&
                    a.threshold === d.threshold &&
                    a.trackFirstImpressionOnly === d.trackFirstImpressionOnly
                );
            })
                ? c.push(d)
                : b.push(d);
        });
        if (b.length) {
            var d = L(this, b),
                e = L(this, c);
            this.items = d.items;
            this.h = d.h;
            this.g = d.g;
            c.forEach(function(a) {
                if (!d.h[a.id]) {
                    var b = e.g[a.threshold],
                        c = e.h[a.id];
                    c && b.unobserve(c);
                    d.g[a.threshold] || e.g[a.threshold].disconnect();
                }
            });
        } else this.unobserveAllElements();
    };
    f.unobserveAllElements = function() {
        var a = this;
        Object.keys(this.g).forEach(function(b) {
            a.g[b].disconnect();
        });
        this.b.disconnect();
        this.b = null;
        this.items = [];
        this.h = {};
        this.g = {};
    };
    function L(a, b) {
        var c = [],
            d = {},
            e = {};
        b.length &&
            b.forEach(function(b) {
                b = va(b);
                c.push(b);
                e[b.id] = a.h[b.id] || null;
                d[b.threshold] = a.g[b.threshold] || null;
            });
        return { items: c, h: e, g: d };
    }
    f.K = function(a) {
        for (var b = 0, c; (c = a[b]); b++) {
            for (var d = 0, e; (e = c.removedNodes[d]); d++) M(this, e, this.J);
            for (d = 0; (e = c.addedNodes[d]); d++) M(this, e, this.I);
        }
    };
    function M(a, b, c) {
        1 == b.nodeType && b.id in a.h && c(b.id);
        for (var d = 0, e; (e = b.childNodes[d]); d++) M(a, e, c);
    }
    f.M = function(a) {
        for (var b = [], c = 0, d; (d = a[c]); c++)
            for (var e = 0, g; (g = this.items[e]); e++) {
                var h;
                if ((h = d.target.id === g.id))
                    (h = g.threshold)
                        ? (h = d.intersectionRatio >= h)
                        : ((h = d.intersectionRect),
                          (h = 0 < h.top || 0 < h.bottom || 0 < h.left || 0 < h.right));
                if (h) {
                    var D = g.id;
                    h = document.getElementById(D);
                    var D = {
                            transport: 'beacon',
                            eventCategory: 'Viewport',
                            eventAction: 'impression',
                            eventLabel: D,
                            nonInteraction: !0,
                        },
                        Da = A({}, this.a.fieldsObj, B(h, this.a.attributePrefix));
                    this.c.send('event', z(D, Da, this.c, this.a.hitFilter, h));
                    g.trackFirstImpressionOnly && b.push(g);
                }
            }
        b.length && this.unobserveElements(b);
    };
    f.I = function(a) {
        var b = this,
            c = (this.h[a] = document.getElementById(a));
        this.items.forEach(function(d) {
            a == d.id && b.g[d.threshold].observe(c);
        });
    };
    f.J = function(a) {
        var b = this,
            c = this.h[a];
        this.items.forEach(function(d) {
            a == d.id && b.g[d.threshold].unobserve(c);
        });
        this.h[a] = null;
    };
    f.remove = function() {
        this.unobserveAllElements();
    };
    F('impressionTracker', ua);
    function va(a) {
        'string' == typeof a && (a = { id: a });
        return A({ threshold: 0, trackFirstImpressionOnly: !0 }, a);
    }
    function wa() {
        this.a = {};
    }
    wa.prototype.aa = function(a, b) {
        for (var c = [], d = 1; d < arguments.length; ++d) c[d - 1] = arguments[d];
        (this.a[a] = this.a[a] || []).forEach(function(a) {
            return a.apply(null, [].concat(n(c)));
        });
    };
    var N = {},
        O = !1;
    function P(a, b) {
        this.a = {};
        this.key = a;
        this.H = b || {};
    }
    fa(P, wa);
    function Q(a, b, c) {
        a = ['autotrack', a, b].join(':');
        N[a] ||
            ((N[a] = new P(a, c)),
            (N[a].key = a),
            O || (window.addEventListener('storage', xa), (O = !0)));
        return N[a];
    }
    P.prototype.get = function() {
        var a = String(window.localStorage && window.localStorage.getItem(this.key));
        return 'string' != typeof a ? {} : R(a, this.H);
    };
    P.prototype.set = function(a) {
        var b = this.get();
        a = A(b, a);
        window.localStorage && window.localStorage.setItem(this.key, JSON.stringify(a));
    };
    P.prototype.j = function() {
        delete N[this.key];
        Object.keys(N).length || (window.removeEventListener('storage', xa), (O = !1));
    };
    function xa(a) {
        var b = N[a.key];
        if (b) {
            var c = R(a.oldValue, b.H);
            a = R(a.newValue, b.H);
            b.aa('externalSet', a, c);
        }
    }
    function R(a, b) {
        var c;
        try {
            c = JSON.parse(a);
        } catch (d) {
            c = {};
        }
        return A({}, b, c);
    }
    var ya = {};
    function S(a, b, c) {
        this.f = a;
        this.timeout = b || T;
        this.timeZone = c;
        b = this.b = this.b.bind(this);
        w(y(a, 'sendHitTask'), b);
        try {
            this.c = new Intl.DateTimeFormat('en-US', { timeZone: this.timeZone });
        } catch (d) {}
        this.a = Q(a.get('trackingId'), 'session', { hitTime: 0, isExpired: !1 });
    }
    S.prototype.isExpired = function(a) {
        a = a ? a : this.a.get();
        if (a.isExpired) return !0;
        var b = new Date(),
            c = (a = a.hitTime) && new Date(a);
        return a && (b - c > 6e4 * this.timeout || (this.c && this.c.format(b) != this.c.format(c)))
            ? !0
            : !1;
    };
    S.prototype.b = function(a) {
        var b = this;
        return function(c) {
            a(c);
            var d = b.a.get(),
                e = b.isExpired(d);
            c = c.get('sessionControl');
            d.hitTime = +new Date();
            if ('start' == c || e) d.isExpired = !1;
            'end' == c && (d.isExpired = !0);
            b.a.set(d);
        };
    };
    S.prototype.j = function() {
        var a = this.b;
        x(y(this.f, 'sendHitTask'), a);
        this.a.j();
        delete ya[this.f.get('trackingId')];
    };
    var T = 30;
    function U(a, b) {
        I(a, G.U);
        window.addEventListener &&
            ((this.a = A({ increaseThreshold: 20, sessionTimeout: T, fieldsObj: {} }, b)),
            (this.c = a),
            (this.b = za(this)),
            (this.f = ra(this.f.bind(this), 500)),
            (this.s = this.s.bind(this)),
            (this.i = Q(a.get('trackingId'), 'plugins/max-scroll-tracker')),
            (this.O = new S(a, this.a.sessionTimeout, this.a.timeZone)),
            (b = this.s),
            w(y(a, 'set'), b),
            Aa(this));
    }
    function Aa(a) {
        100 > (a.i.get()[a.b] || 0) && window.addEventListener('scroll', a.f);
    }
    U.prototype.f = function() {
        var a = document.documentElement,
            b = document.body,
            a = Math.min(
                100,
                Math.max(
                    0,
                    Math.round(
                        (window.pageYOffset /
                            (Math.max(
                                a.offsetHeight,
                                a.scrollHeight,
                                b.offsetHeight,
                                b.scrollHeight
                            ) -
                                window.innerHeight)) *
                            100
                    )
                )
            );
        if (this.O.isExpired()) window.localStorage && window.localStorage.removeItem(this.i.key);
        else if (
            ((b = this.i.get()[this.b] || 0),
            a > b &&
                ((100 != a && 100 != b) || window.removeEventListener('scroll', this.f),
                (b = a - b),
                100 == a || b >= this.a.increaseThreshold))
        ) {
            var c = {};
            this.i.set(((c[this.b] = a), c));
            a = {
                transport: 'beacon',
                eventCategory: 'Max Scroll',
                eventAction: 'increase',
                eventValue: b,
                eventLabel: String(a),
                nonInteraction: !0,
            };
            this.a.maxScrollMetricIndex && (a['metric' + this.a.maxScrollMetricIndex] = b);
            this.c.send('event', z(a, this.a.fieldsObj, this.c, this.a.hitFilter));
        }
    };
    U.prototype.s = function(a) {
        var b = this;
        return function(c) {
            for (var d = [], e = 0; e < arguments.length; ++e) d[e - 0] = arguments[e];
            a.apply(null, [].concat(n(d)));
            e = {};
            (C(d[0]) ? d[0] : ((e[d[0]] = d[1]), e)).page &&
                ((d = b.b), (b.b = za(b)), b.b != d && Aa(b));
        };
    };
    function za(a) {
        a = u(a.c.get('page') || a.c.get('location'));
        return a.pathname + a.search;
    }
    U.prototype.remove = function() {
        this.O.j();
        window.removeEventListener('scroll', this.f);
        var a = this.s;
        x(y(this.c, 'set'), a);
    };
    F('maxScrollTracker', U);
    var Ba = {};
    function V(a, b) {
        I(a, G.V);
        window.matchMedia &&
            ((this.a = A(
                { changeTemplate: this.changeTemplate, changeTimeout: 1e3, fieldsObj: {} },
                b
            )),
            C(this.a.definitions) &&
                ((b = this.a.definitions),
                (this.a.definitions = Array.isArray(b) ? b : [b]),
                (this.b = a),
                (this.c = []),
                Ca(this)));
    }
    function Ca(a) {
        a.a.definitions.forEach(function(b) {
            if (b.name && b.dimensionIndex) {
                var c = Ea(b);
                a.b.set('dimension' + b.dimensionIndex, c);
                Fa(a, b);
            }
        });
    }
    function Ea(a) {
        var b;
        a.items.forEach(function(a) {
            Ga(a.media).matches && (b = a);
        });
        return b ? b.name : '(not set)';
    }
    function Fa(a, b) {
        b.items.forEach(function(c) {
            c = Ga(c.media);
            var d = ra(function() {
                var c = Ea(b),
                    d = a.b.get('dimension' + b.dimensionIndex);
                c !== d &&
                    (a.b.set('dimension' + b.dimensionIndex, c),
                    (c = {
                        transport: 'beacon',
                        eventCategory: b.name,
                        eventAction: 'change',
                        eventLabel: a.a.changeTemplate(d, c),
                        nonInteraction: !0,
                    }),
                    a.b.send('event', z(c, a.a.fieldsObj, a.b, a.a.hitFilter)));
            }, a.a.changeTimeout);
            c.addListener(d);
            a.c.push({ ca: c, ba: d });
        });
    }
    V.prototype.remove = function() {
        for (var a = 0, b; (b = this.c[a]); a++) b.ca.removeListener(b.ba);
    };
    V.prototype.changeTemplate = function(a, b) {
        return a + ' \x3d\x3e ' + b;
    };
    F('mediaQueryTracker', V);
    function Ga(a) {
        return Ba[a] || (Ba[a] = window.matchMedia(a));
    }
    function W(a, b) {
        I(a, G.W);
        window.addEventListener &&
            ((this.a = A(
                {
                    formSelector: 'form',
                    shouldTrackOutboundForm: this.shouldTrackOutboundForm,
                    fieldsObj: {},
                    attributePrefix: 'ga-',
                },
                b
            )),
            (this.b = a),
            (this.c = q('submit', this.a.formSelector, this.f.bind(this))));
    }
    W.prototype.f = function(a, b) {
        var c = {
            transport: 'beacon',
            eventCategory: 'Outbound Form',
            eventAction: 'submit',
            eventLabel: u(b.action).href,
        };
        this.a.shouldTrackOutboundForm(b, u) &&
            (navigator.sendBeacon ||
                (a.preventDefault(),
                (c.hitCallback = sa(function() {
                    b.submit();
                }))),
            (a = A({}, this.a.fieldsObj, B(b, this.a.attributePrefix))),
            this.b.send('event', z(c, a, this.b, this.a.hitFilter, b)));
    };
    W.prototype.shouldTrackOutboundForm = function(a, b) {
        a = b(a.action);
        return a.hostname != location.hostname && 'http' == a.protocol.slice(0, 4);
    };
    W.prototype.remove = function() {
        this.c.j();
    };
    F('outboundFormTracker', W);
    function X(a, b) {
        var c = this;
        I(a, G.X);
        window.addEventListener &&
            ((this.a = A(
                {
                    events: ['click'],
                    linkSelector: 'a, area',
                    shouldTrackOutboundLink: this.shouldTrackOutboundLink,
                    fieldsObj: {},
                    attributePrefix: 'ga-',
                },
                b
            )),
            (this.f = a),
            (this.c = this.c.bind(this)),
            (this.b = {}),
            this.a.events.forEach(function(a) {
                c.b[a] = q(a, c.a.linkSelector, c.c);
            }));
    }
    X.prototype.c = function(a, b) {
        if (this.a.shouldTrackOutboundLink(b, u)) {
            var c = b.getAttribute('href') || b.getAttribute('xlink:href'),
                d = u(c),
                e = {
                    transport: 'beacon',
                    eventCategory: 'Outbound Link',
                    eventAction: a.type,
                    eventLabel: d.href,
                };
            navigator.sendBeacon ||
                'click' != a.type ||
                '_blank' == b.target ||
                a.metaKey ||
                a.ctrlKey ||
                a.shiftKey ||
                a.altKey ||
                1 < a.which ||
                window.addEventListener('click', function(a) {
                    a.defaultPrevented ||
                        (a.preventDefault(),
                        (e.hitCallback = sa(function() {
                            location.href = c;
                        })));
                });
            a = A({}, this.a.fieldsObj, B(b, this.a.attributePrefix));
            this.f.send('event', z(e, a, this.f, this.a.hitFilter, b));
        }
    };
    X.prototype.shouldTrackOutboundLink = function(a, b) {
        a = a.getAttribute('href') || a.getAttribute('xlink:href');
        b = b(a);
        return b.hostname != location.hostname && 'http' == b.protocol.slice(0, 4);
    };
    X.prototype.remove = function() {
        var a = this;
        Object.keys(this.b).forEach(function(b) {
            a.b[b].j();
        });
    };
    F('outboundLinkTracker', X);
    var Y = (function Ha(b) {
        return b
            ? (b ^ ((16 * Math.random()) >> (b / 4))).toString(16)
            : '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, Ha);
    })();
    function Ia(a, b) {
        I(a, G.Y);
        if (window.addEventListener) {
            this.a = A({ sessionTimeout: T, fieldsObj: {} }, b);
            this.c = a;
            this.f = null;
            this.o = this.o.bind(this);
            this.l = this.l.bind(this);
            this.C = this.C.bind(this);
            this.L = this.L.bind(this);
            this.b = Q(a.get('trackingId'), 'plugins/page-visibility-tracker');
            b = this.L;
            var c = this.b;
            (c.a.externalSet = c.a.externalSet || []).push(b);
            this.i = new S(a, this.a.sessionTimeout, this.a.timeZone);
            b = this.o;
            w(y(a, 'set'), b);
            document.addEventListener('visibilitychange', this.l);
            window.addEventListener('unload', this.C);
            'visible' == document.visibilityState && this.l();
        }
    }
    f = Ia.prototype;
    f.l = function() {
        var a = this.b.get();
        'visible' == this.f &&
            'hidden' == a.state &&
            a.pageId != Y &&
            ((a.state = 'visible'), (a.pageId = Y), this.b.set(a));
        var b = { time: +new Date(), state: document.visibilityState, pageId: Y };
        this.i.isExpired()
            ? 'hidden' == document.visibilityState
                ? window.localStorage && window.localStorage.removeItem(this.b.key)
                : (this.c.send(
                      'pageview',
                      z({ transport: 'beacon' }, this.a.fieldsObj, this.c, this.a.hitFilter)
                  ),
                  this.b.set(b))
            : (a.pageId == Y && 'visible' == a.state && Ja(this, a), this.b.set(b));
        this.f = document.visibilityState;
    };
    function Ja(a, b, c) {
        var d = {
            transport: 'beacon',
            nonInteraction: !0,
            eventCategory: 'Page Visibility',
            eventAction: 'track',
            eventLabel: '(not set)',
        };
        c && (d.da = +new Date() - c);
        var e = c,
            e = void 0 === e ? +new Date() : e;
        c = !a.i.isExpired();
        b = b.time && Math.round((e - b.time) / 1e3);
        if ((b = c && 0 < b ? b : 0))
            (d.eventValue = b),
                a.a.visibleMetricIndex && (d['metric' + a.a.visibleMetricIndex] = b);
        a.c.send('event', z(d, a.a.fieldsObj, a.c, a.a.hitFilter));
    }
    f.o = function(a) {
        var b = this;
        return function(c) {
            for (var d = [], e = 0; e < arguments.length; ++e) d[e - 0] = arguments[e];
            e = {};
            e = C(d[0]) ? d[0] : ((e[d[0]] = d[1]), e);
            e.page && e.page !== b.c.get('page') && 'visible' == b.f && b.l();
            a.apply(null, [].concat(n(d)));
        };
    };
    f.L = function(a, b) {
        a.time != b.time && b.pageId == Y && 'visible' == b.state && Ja(this, b, a.time);
    };
    f.C = function() {
        'hidden' != this.f && this.l();
    };
    f.remove = function() {
        this.i.j();
        var a = this.o;
        x(y(this.c, 'set'), a);
        window.removeEventListener('unload', this.C);
        document.removeEventListener('visibilitychange', this.l);
    };
    F('pageVisibilityTracker', Ia);
    function Ka(a, b) {
        I(a, G.Z);
        window.addEventListener &&
            ((this.a = A({ fieldsObj: {}, hitFilter: null }, b)),
            (this.b = a),
            (this.m = this.m.bind(this)),
            (this.G = this.G.bind(this)),
            (this.A = this.A.bind(this)),
            (this.u = this.u.bind(this)),
            (this.v = this.v.bind(this)),
            (this.B = this.B.bind(this)),
            'complete' != document.readyState ? window.addEventListener('load', this.m) : this.m());
    }
    f = Ka.prototype;
    f.m = function() {
        if (window.FB)
            try {
                window.FB.Event.subscribe('edge.create', this.v),
                    window.FB.Event.subscribe('edge.remove', this.B);
            } catch (a) {}
        window.twttr && this.G();
    };
    f.G = function() {
        var a = this;
        try {
            window.twttr.ready(function() {
                window.twttr.events.bind('tweet', a.A);
                window.twttr.events.bind('follow', a.u);
            });
        } catch (b) {}
    };
    function La(a) {
        try {
            window.twttr.ready(function() {
                window.twttr.events.unbind('tweet', a.A);
                window.twttr.events.unbind('follow', a.u);
            });
        } catch (b) {}
    }
    f.A = function(a) {
        'tweet' == a.region &&
            ((a = {
                transport: 'beacon',
                socialNetwork: 'Twitter',
                socialAction: 'tweet',
                socialTarget: a.data.url || a.target.getAttribute('data-url') || location.href,
            }),
            this.b.send('social', z(a, this.a.fieldsObj, this.b, this.a.hitFilter)));
    };
    f.u = function(a) {
        'follow' == a.region &&
            ((a = {
                transport: 'beacon',
                socialNetwork: 'Twitter',
                socialAction: 'follow',
                socialTarget: a.data.screen_name || a.target.getAttribute('data-screen-name'),
            }),
            this.b.send('social', z(a, this.a.fieldsObj, this.b, this.a.hitFilter)));
    };
    f.v = function(a) {
        this.b.send(
            'social',
            z(
                {
                    transport: 'beacon',
                    socialNetwork: 'Facebook',
                    socialAction: 'like',
                    socialTarget: a,
                },
                this.a.fieldsObj,
                this.b,
                this.a.hitFilter
            )
        );
    };
    f.B = function(a) {
        this.b.send(
            'social',
            z(
                {
                    transport: 'beacon',
                    socialNetwork: 'Facebook',
                    socialAction: 'unlike',
                    socialTarget: a,
                },
                this.a.fieldsObj,
                this.b,
                this.a.hitFilter
            )
        );
    };
    f.remove = function() {
        window.removeEventListener('load', this.m);
        try {
            window.FB.Event.unsubscribe('edge.create', this.v),
                window.FB.Event.unsubscribe('edge.remove', this.B);
        } catch (a) {}
        La(this);
    };
    F('socialWidgetTracker', Ka);
    function Ma(a, b) {
        I(a, G.$);
        history.pushState &&
            window.addEventListener &&
            ((this.a = A(
                {
                    shouldTrackUrlChange: this.shouldTrackUrlChange,
                    trackReplaceState: !1,
                    fieldsObj: {},
                    hitFilter: null,
                },
                b
            )),
            (this.b = a),
            (this.c = location.pathname + location.search),
            (this.D = this.D.bind(this)),
            (this.F = this.F.bind(this)),
            (this.w = this.w.bind(this)),
            (a = this.D),
            w(y(history, 'pushState'), a),
            (a = this.F),
            w(y(history, 'replaceState'), a),
            window.addEventListener('popstate', this.w));
    }
    f = Ma.prototype;
    f.D = function(a) {
        var b = this;
        return function(c) {
            for (var d = [], e = 0; e < arguments.length; ++e) d[e - 0] = arguments[e];
            a.apply(null, [].concat(n(d)));
            Z(b, !0);
        };
    };
    f.F = function(a) {
        var b = this;
        return function(c) {
            for (var d = [], e = 0; e < arguments.length; ++e) d[e - 0] = arguments[e];
            a.apply(null, [].concat(n(d)));
            Z(b, !1);
        };
    };
    f.w = function() {
        Z(this, !0);
    };
    function Z(a, b) {
        setTimeout(function() {
            var c = a.c,
                d = location.pathname + location.search;
            c != d &&
                a.a.shouldTrackUrlChange.call(a, d, c) &&
                ((a.c = d),
                a.b.set({ page: d, title: document.title }),
                (b || a.a.trackReplaceState) &&
                    a.b.send(
                        'pageview',
                        z({ transport: 'beacon' }, a.a.fieldsObj, a.b, a.a.hitFilter)
                    ));
        }, 0);
    }
    f.shouldTrackUrlChange = function(a, b) {
        return !(!a || !b);
    };
    f.remove = function() {
        var a = this.D;
        x(y(history, 'pushState'), a);
        a = this.F;
        x(y(history, 'replaceState'), a);
        window.removeEventListener('popstate', this.w);
    };
    F('urlChangeTracker', Ma);
})();
//# sourceMappingURL=autotrack.js.map
