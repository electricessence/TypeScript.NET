/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based on: https://en.wikipedia.org/wiki/Uniform_Resource_Identifier
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _Types = require('../Types');

var _Types2 = _interopRequireDefault(_Types);

var _UriQueryParams = require('../Uri/QueryParams');

var QueryParams = _interopRequireWildcard(_UriQueryParams);

var _TextUtility = require('../Text/Utility');

var _UriScheme = require('../Uri/Scheme');

var _UriScheme2 = _interopRequireDefault(_UriScheme);

var _ExceptionsArgumentException = require('../Exceptions/ArgumentException');

var _ExceptionsArgumentException2 = _interopRequireDefault(_ExceptionsArgumentException);

var _ExceptionsArgumentOutOfRangeException = require('../Exceptions/ArgumentOutOfRangeException');

var _ExceptionsArgumentOutOfRangeException2 = _interopRequireDefault(_ExceptionsArgumentOutOfRangeException);

var Uri = (function () {
    function Uri(scheme, userInfo, host, port, path, query, fragment) {
        _classCallCheck(this, Uri);

        var _ = this;
        _.scheme = getScheme(scheme) || null;
        _.userInfo = userInfo || null;
        _.host = host || null;
        _.port = port || null;
        _.authority = _.getAuthority() || null;
        _.path = path || null;
        if (!_Types2['default'].isString(query)) query = QueryParams.encode(query);
        _.query = formatQuery(query) || null;
        Object.freeze(_.queryParams = _.query ? QueryParams.parseToMap(_.query) : {});
        _.pathAndQuery = _.getPathAndQuery() || null;
        _.fragment = formatFragment(fragment) || null;
        _.absoluteUri = _.getAbsoluteUri();
        Object.freeze(_);
    }

    _createClass(Uri, [{
        key: 'equals',
        value: function equals(other) {
            return this === other || this.absoluteUri == Uri.toString(other);
        }
    }, {
        key: 'copyTo',
        value: function copyTo(map) {
            return copyUri(this, map);
        }
    }, {
        key: 'getAbsoluteUri',
        value: function getAbsoluteUri() {
            return uriToString(this);
        }
    }, {
        key: 'getAuthority',
        value: (function (_getAuthority) {
            function getAuthority() {
                return _getAuthority.apply(this, arguments);
            }

            getAuthority.toString = function () {
                return _getAuthority.toString();
            };

            return getAuthority;
        })(function () {
            return getAuthority(this);
        })
    }, {
        key: 'getPathAndQuery',
        value: (function (_getPathAndQuery) {
            function getPathAndQuery() {
                return _getPathAndQuery.apply(this, arguments);
            }

            getPathAndQuery.toString = function () {
                return _getPathAndQuery.toString();
            };

            return getPathAndQuery;
        })(function () {
            return getPathAndQuery(this);
        })
    }, {
        key: 'toMap',
        value: function toMap() {
            return this.copyTo({});
        }
    }, {
        key: 'toString',
        value: function toString() {
            return this.absoluteUri;
        }
    }, {
        key: 'pathSegments',
        get: function get() {
            return this.path.match(/^[/]|[^/]*[/]|[^/]+$/g);
        }
    }], [{
        key: 'from',
        value: function from(url) {
            var uri = !url || _Types2['default'].isString(url) ? Uri.parse(url) : url;
            return new Uri(uri.scheme, uri.userInfo, uri.host, uri.port, uri.path, uri.query, uri.fragment);
        }
    }, {
        key: 'parse',
        value: function parse(url) {
            var throwIfInvalid = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

            var result = null;
            var ex = tryParse(url, function (out) {
                result = out;
            });
            if (throwIfInvalid && ex) throw ex;
            return result;
        }
    }, {
        key: 'tryParse',
        value: (function (_tryParse) {
            function tryParse(_x, _x2) {
                return _tryParse.apply(this, arguments);
            }

            tryParse.toString = function () {
                return _tryParse.toString();
            };

            return tryParse;
        })(function (url, out) {
            return !tryParse(url, out);
        })
    }, {
        key: 'copyOf',
        value: function copyOf(map) {
            return copyUri(map);
        }
    }, {
        key: 'toString',
        value: function toString(uri) {
            return _Types2['default'].isInstanceOf(uri, Uri) ? uri.absoluteUri : uriToString(uri);
        }
    }, {
        key: 'getAuthority',
        value: (function (_getAuthority2) {
            function getAuthority(_x3) {
                return _getAuthority2.apply(this, arguments);
            }

            getAuthority.toString = function () {
                return _getAuthority2.toString();
            };

            return getAuthority;
        })(function (uri) {
            return getAuthority(uri);
        })
    }]);

    return Uri;
})();

(function (Uri) {
    (function (Fields) {
        Fields[Fields["scheme"] = 0] = "scheme";
        Fields[Fields["userInfo"] = 1] = "userInfo";
        Fields[Fields["host"] = 2] = "host";
        Fields[Fields["port"] = 3] = "port";
        Fields[Fields["path"] = 4] = "path";
        Fields[Fields["query"] = 5] = "query";
        Fields[Fields["fragment"] = 6] = "fragment";
    })(Uri.Fields || (Uri.Fields = {}));
    var Fields = Uri.Fields;
    Object.freeze(Fields);
})(Uri || (Uri = {}));
function copyUri(from) {
    var to = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var i = 0,
        field;
    while (field = Uri.Fields[i++]) {
        var value = from[field];
        if (value) to[field] = value;
    }
    return to;
}
var SLASH = '/',
    SLASH2 = '//',
    QM = '?',
    HASH = '#',
    EMPTY = '',
    AT = '@';
function getScheme(scheme) {
    var s = scheme;
    if (_Types2['default'].isString(s)) {
        if (!s) return undefined;
        s = _UriScheme2['default'][(0, _TextUtility.trim)(s).toLowerCase().replace(/[^a-z0-9+.-]+$/g, EMPTY)];
        if (isNaN(s)) throw new _ExceptionsArgumentOutOfRangeException2['default']('scheme', scheme, 'Invalid scheme.');
    }
    if (_Types2['default'].isNumber(s, false)) {
        s = _UriScheme2['default'][s];
        if (!s) throw new _ExceptionsArgumentOutOfRangeException2['default']('scheme', scheme, 'Invalid scheme.');
        return s;
    }
    return undefined;
}
function getAuthority(uri) {
    if (!uri.host) {
        if (uri.userInfo) throw new _ExceptionsArgumentException2['default']('host', 'Cannot include user info when there is no host.');
        if (_Types2['default'].isNumber(uri.port, false)) throw new _ExceptionsArgumentException2['default']('host', 'Cannot include a port when there is no host.');
    }
    var result = uri.host || EMPTY;
    if (result) {
        if (uri.userInfo) result = uri.userInfo + AT + result;
        if (!isNaN(uri.port)) result += ':' + uri.port;
        result = SLASH2 + result;
    }
    return result;
}
function formatQuery(query) {
    return query && (query.indexOf(QM) == -1 ? QM : EMPTY) + query;
}
function formatFragment(fragment) {
    return fragment && (fragment.indexOf(HASH) == -1 ? HASH : EMPTY) + fragment;
}
function getPathAndQuery(uri) {
    var path = uri.path,
        query = uri.query;
    return EMPTY + (path && (path.indexOf(SLASH) == -1 ? SLASH : EMPTY) + path || EMPTY) + (formatQuery(query) || EMPTY);
}
function uriToString(uri) {
    // scheme:[//[user:password@]domain[:port]][/]path[?query][#fragment]
    // {scheme}{authority}{path}{query}{fragment}
    var scheme = getScheme(uri.scheme),
        authority = getAuthority(uri),
        pathAndQuery = getPathAndQuery(uri),
        fragment = formatFragment(uri.fragment);
    return EMPTY + (scheme && scheme + ':' || EMPTY) + (authority || EMPTY) + (pathAndQuery || EMPTY) + (fragment || EMPTY);
}
function tryParse(url, out) {
    if (!url) return new _ExceptionsArgumentException2['default']('url', 'Nothing to parse.');
    var i,
        result = {};
    i = url.indexOf(HASH);
    if (i != -1) {
        result.fragment = url.substring(i);
        url = url.substring(0, i);
    }
    i = url.indexOf(QM);
    if (i != -1) {
        result.query = url.substring(i);
        url = url.substring(0, i);
    }
    i = url.indexOf(SLASH2);
    if (i != -1) {
        var scheme = (0, _TextUtility.trim)(url.substring(0, i)),
            c = /:$/;
        if (!c.test(scheme)) return new _ExceptionsArgumentException2['default']('url', 'Scheme was improperly formatted');
        scheme = (0, _TextUtility.trim)(scheme.replace(c, EMPTY));
        result.scheme = scheme || undefined;
        url = url.substring(i + 2);
    }
    i = url.indexOf(SLASH);
    if (i != -1) {
        result.path = url.substring(i) || undefined;
        url = url.substring(0, i);
    }
    i = url.indexOf(AT);
    if (i != -1) {
        result.userInfo = url.substring(0, i) || undefined;
        url = url.substring(i + 1);
    }
    i = url.indexOf(':');
    if (i != -1) {
        var port = parseInt((0, _TextUtility.trim)(url.substring(i + 1)));
        if (isNaN(port)) return new _ExceptionsArgumentException2['default']('url', 'Port was invalid.');
        result.port = port;
        url = url.substring(0, i);
    }
    url = (0, _TextUtility.trim)(url);
    if (url) result.host = url;
    out(copyUri(result));
    return null;
}
exports['default'] = Uri;
module.exports = exports['default'];
//# sourceMappingURL=Uri.js.map
