/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based on: https://en.wikipedia.org/wiki/Uniform_Resource_Identifier
 */
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Types_1 = require("../Types");
var QueryParams = require("./QueryParams");
var Scheme = require("./Scheme");
var Utility_1 = require("../Text/Utility");
var ArgumentException_1 = require("../Exceptions/ArgumentException");
var ArgumentOutOfRangeException_1 = require("../Exceptions/ArgumentOutOfRangeException");
var VOID0 = void 0;

var Uri = function () {
    function Uri(scheme, userInfo, host, port, path, query, fragment) {
        _classCallCheck(this, Uri);

        var _ = this;
        _.scheme = getScheme(scheme) || null;
        _.userInfo = userInfo || null;
        _.host = host || null;
        _.port = getPort(port);
        _.authority = _.getAuthority() || null;
        _.path = path || null;
        if (!Types_1.Type.isString(query)) query = QueryParams.encode(query);
        _.query = formatQuery(query) || null;
        Object.freeze(_.queryParams = _.query ? QueryParams.parseToMap(_.query) : {});
        _.pathAndQuery = _.getPathAndQuery() || null;
        _.fragment = formatFragment(fragment) || null;
        _.absoluteUri = _.getAbsoluteUri();
        _.baseUri = _.absoluteUri.replace(/[?#].*/, '');
        Object.freeze(_);
    }

    _createClass(Uri, [{
        key: "equals",
        value: function equals(other) {
            return this === other || this.absoluteUri == Uri.toString(other);
        }
    }, {
        key: "copyTo",
        value: function copyTo(map) {
            return copyUri(this, map);
        }
    }, {
        key: "updateQuery",
        value: function updateQuery(query) {
            var map = this.toMap();
            map.query = query;
            return Uri.from(map);
        }
    }, {
        key: "getAbsoluteUri",
        value: function getAbsoluteUri() {
            return uriToString(this);
        }
    }, {
        key: "getAuthority",
        value: function getAuthority() {
            return _getAuthority(this);
        }
    }, {
        key: "getPathAndQuery",
        value: function getPathAndQuery() {
            return _getPathAndQuery(this);
        }
    }, {
        key: "toMap",
        value: function toMap() {
            return this.copyTo({});
        }
    }, {
        key: "toString",
        value: function toString() {
            return this.absoluteUri;
        }
    }, {
        key: "pathSegments",
        get: function get() {
            return this.path.match(/^[/]|[^/]*[/]|[^/]+$/g);
        }
    }], [{
        key: "from",
        value: function from(uri, defaults) {
            var u = !uri || Types_1.Type.isString(uri) ? Uri.parse(uri) : uri;
            return new Uri(u.scheme || defaults && defaults.scheme, u.userInfo || defaults && defaults.userInfo, u.host || defaults && defaults.host, isNaN(u.port) ? defaults && defaults.port : u.port, u.path || defaults && defaults.path, u.query || defaults && defaults.query, u.fragment || defaults && defaults.fragment);
        }
    }, {
        key: "parse",
        value: function parse(url) {
            var throwIfInvalid = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

            var result = null;
            var ex = _tryParse(url, function (out) {
                result = out;
            });
            if (throwIfInvalid && ex) throw ex;
            return result;
        }
    }, {
        key: "tryParse",
        value: function tryParse(url, out) {
            return !_tryParse(url, out);
        }
    }, {
        key: "copyOf",
        value: function copyOf(map) {
            return copyUri(map);
        }
    }, {
        key: "toString",
        value: function toString(uri) {
            return uri instanceof Uri ? uri.absoluteUri : uriToString(uri);
        }
    }, {
        key: "getAuthority",
        value: function getAuthority(uri) {
            return _getAuthority(uri);
        }
    }]);

    return Uri;
}();

exports.Uri = Uri;
(function (Fields) {
    Fields[Fields["scheme"] = 0] = "scheme";
    Fields[Fields["userInfo"] = 1] = "userInfo";
    Fields[Fields["host"] = 2] = "host";
    Fields[Fields["port"] = 3] = "port";
    Fields[Fields["path"] = 4] = "path";
    Fields[Fields["query"] = 5] = "query";
    Fields[Fields["fragment"] = 6] = "fragment";
})(exports.Fields || (exports.Fields = {}));
var Fields = exports.Fields;
Object.freeze(Fields);
function copyUri(from, to) {
    var i = 0,
        field;
    if (!to) to = {};
    while (field = Fields[i++]) {
        var value = from[field];
        if (value) to[field] = value;
    }
    return to;
}
var SLASH = '/',
    SLASH2 = '//',
    QM = QueryParams.Separator.Query,
    HASH = '#',
    EMPTY = '',
    AT = '@';
function getScheme(scheme) {
    var s = scheme;
    if (Types_1.Type.isString(s)) {
        if (!s) return null;
        s = Utility_1.trim(s).toLowerCase().replace(/[^a-z0-9+.-]+$/g, EMPTY);
        if (!s) return null;
        if (Scheme.isValid(s)) return s;
    } else {
        if (s === null || s === undefined) return s;
    }
    throw new ArgumentOutOfRangeException_1.ArgumentOutOfRangeException('scheme', scheme, 'Invalid scheme.');
}
function getPort(port) {
    if (port === 0) return port;
    if (!port) return null;
    var p;
    if (Types_1.Type.isNumber(port, true)) {
        p = port;
        if (p >= 0 && isFinite(p)) return p;
    } else if (Types_1.Type.isString(port) && (p = parseInt(port)) && !isNaN(p)) {
        return getPort(p);
    }
    throw new ArgumentException_1.ArgumentException("port", "invalid value");
}
function _getAuthority(uri) {
    if (!uri.host) {
        if (uri.userInfo) throw new ArgumentException_1.ArgumentException('host', 'Cannot include user info when there is no host.');
        if (Types_1.Type.isNumber(uri.port, false)) throw new ArgumentException_1.ArgumentException('host', 'Cannot include a port when there is no host.');
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
    return query && (query.indexOf(QM) !== 0 ? QM : EMPTY) + query;
}
function formatFragment(fragment) {
    return fragment && (fragment.indexOf(HASH) !== 0 ? HASH : EMPTY) + fragment;
}
function _getPathAndQuery(uri) {
    var path = uri.path,
        query = uri.query;
    return EMPTY + (path || EMPTY) + (formatQuery(query) || EMPTY);
}
function uriToString(uri) {
    var scheme = getScheme(uri.scheme),
        authority = _getAuthority(uri),
        pathAndQuery = _getPathAndQuery(uri),
        fragment = formatFragment(uri.fragment);
    var part1 = EMPTY + (scheme && scheme + ':' || EMPTY) + (authority || EMPTY);
    var part2 = EMPTY + (pathAndQuery || EMPTY) + (fragment || EMPTY);
    if (part1 && part2 && scheme && !authority) throw new ArgumentException_1.ArgumentException('authority', "Cannot format schemed Uri with missing authority.");
    if (part1 && pathAndQuery && pathAndQuery.indexOf(SLASH) !== 0) part2 = SLASH + part2;
    return part1 + part2;
}
function _tryParse(url, out) {
    if (!url) return new ArgumentException_1.ArgumentException('url', 'Nothing to parse.');
    var i,
        result = {};
    i = url.indexOf(HASH);
    if (i != -1) {
        result.fragment = url.substring(i + 1) || VOID0;
        url = url.substring(0, i);
    }
    i = url.indexOf(QM);
    if (i != -1) {
        result.query = url.substring(i + 1) || VOID0;
        url = url.substring(0, i);
    }
    i = url.indexOf(SLASH2);
    if (i != -1) {
        var scheme = Utility_1.trim(url.substring(0, i)),
            c = /:$/;
        if (!c.test(scheme)) return new ArgumentException_1.ArgumentException('url', 'Scheme was improperly formatted');
        scheme = Utility_1.trim(scheme.replace(c, EMPTY));
        try {
            result.scheme = getScheme(scheme) || VOID0;
        } catch (ex) {
            return ex;
        }
        url = url.substring(i + 2);
    }
    i = url.indexOf(SLASH);
    if (i != -1) {
        result.path = url.substring(i);
        url = url.substring(0, i);
    }
    i = url.indexOf(AT);
    if (i != -1) {
        result.userInfo = url.substring(0, i) || VOID0;
        url = url.substring(i + 1);
    }
    i = url.indexOf(':');
    if (i != -1) {
        var port = parseInt(Utility_1.trim(url.substring(i + 1)));
        if (isNaN(port)) return new ArgumentException_1.ArgumentException('url', 'Port was invalid.');
        result.port = port;
        url = url.substring(0, i);
    }
    url = Utility_1.trim(url);
    if (url) result.host = url;
    out(copyUri(result));
    return null;
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Uri;
//# sourceMappingURL=Uri.js.map
