/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based on: https://en.wikipedia.org/wiki/Uniform_Resource_Identifier
 */
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", '../Types', '../Uri/QueryParams', '../Text/Utility', '../Uri/Scheme', '../Exceptions/ArgumentException', '../Exceptions/ArgumentOutOfRangeException'], factory);
    }
})(function (require, exports) {
    ///<reference path="IUri.d.ts"/>
    ///<reference path="../IEquatable.d.ts"/>
    ///<reference path="../Primitive.d.ts"/>
    'use strict'; // For compatibility with (let, const, function, class);
    var Types_1 = require('../Types');
    var QueryParams = require('../Uri/QueryParams');
    var Utility_1 = require('../Text/Utility');
    var Scheme_1 = require('../Uri/Scheme');
    var ArgumentException_1 = require('../Exceptions/ArgumentException');
    var ArgumentOutOfRangeException_1 = require('../Exceptions/ArgumentOutOfRangeException');
    /**
     * Provides an read-only model representation of a uniform resource identifier (URI) and easy access to the parts of the URI.
     *
     * The read-only model (frozen) is easier for debugging than exposing accessors for each property.
     * ICloneable&lt;Uri&gt; is not used to prevent unnecessary copying of values that won't change.
     */
    var Uri = (function () {
        /**
         * @param scheme The user name, password, or other user-specific information associated with the specified URI.
         * @param userInfo The host component of this instance.
         * @param host The port number of this URI.
         * @param port The absolute path of the URI.
         * @param path The absolute path of the URI.
         * @param query Any query information included in the specified URI.
         * @param fragment The escaped URI fragment.
         */
        function Uri(scheme, userInfo, host, port, path, query, fragment) {
            var _ = this;
            _.scheme = getScheme(scheme) || null;
            _.userInfo = userInfo || null;
            _.host = host || null;
            _.port = port || null;
            _.authority = _.getAuthority() || null;
            _.path = path || null;
            if (!Types_1.default.isString(query))
                query = QueryParams.encode(query);
            _.query = formatQuery(query) || null;
            Object.freeze(_.queryParams
                = _.query
                    ? QueryParams.parseToMap(_.query)
                    : {});
            _.pathAndQuery = _.getPathAndQuery() || null;
            _.fragment = formatFragment(fragment) || null;
            // This should validate the uri...
            _.absoluteUri = _.getAbsoluteUri();
            _.baseUri = _.absoluteUri.replace('(?|#).*', '');
            // Intended to be read-only.  Call .toMap() to get a writable copy.
            Object.freeze(_);
        }
        /**
         *  Compares the values of another IUri via toString comparison.
         * @param other
         * @returns {boolean}
         */
        Uri.prototype.equals = function (other) {
            return this === other || this.absoluteUri == Uri.toString(other);
        };
        /**
         * Parses or clones values from existing Uri values.
         * @param uri
         * @param defaults
         * @returns {Uri}
         */
        Uri.from = function (uri, defaults) {
            var u = (!uri || Types_1.default.isString(uri))
                ? Uri.parse(uri) : uri;
            return new Uri(u.scheme || defaults && defaults.scheme, u.userInfo || defaults && defaults.userInfo, u.host || defaults && defaults.host, isNaN(u.port) ? defaults && defaults.port : u.port, u.path || defaults && defaults.path, u.query || defaults && defaults.query, u.fragment || defaults && defaults.fragment);
        };
        /**
         * Parses a URL into it's components.
         * @param url The url to parse.
         * @param throwIfInvalid Defaults to true.
         * @returns {IUri} Returns a map of the values or *null* if invalid and *throwIfInvalid* is <b>false</b>.
         */
        Uri.parse = function (url, throwIfInvalid) {
            if (throwIfInvalid === void 0) { throwIfInvalid = true; }
            var result = null;
            var ex = tryParse(url, function (out) { result = out; });
            if (throwIfInvalid && ex)
                throw ex;
            return result;
        };
        /**
         * Parses a URL into it's components.
         * @param url The url to parse.
         * @param out A delegate to capture the value.
         * @returns {boolean} True if valid.  False if invalid.
         */
        Uri.tryParse = function (url, out) {
            return !tryParse(url, out); // return type is Exception.
        };
        Uri.copyOf = function (map) {
            return copyUri(map);
        };
        Uri.prototype.copyTo = function (map) {
            return copyUri(this, map);
        };
        Uri.prototype.updateQuery = function (query) {
            var map = this.toMap();
            map.query = query;
            return Uri.from(map);
        };
        /**
         * Is provided for sub classes to override this value.
         */
        Uri.prototype.getAbsoluteUri = function () {
            return uriToString(this);
        };
        /**
         * Is provided for sub classes to override this value.
         */
        Uri.prototype.getAuthority = function () {
            return getAuthority(this);
        };
        /**
         * Is provided for sub classes to override this value.
         */
        Uri.prototype.getPathAndQuery = function () {
            return getPathAndQuery(this);
        };
        Object.defineProperty(Uri.prototype, "pathSegments", {
            /**
             * The segments that represent a path.<br/>
             * https://msdn.microsoft.com/en-us/library/system.uri.segments%28v=vs.110%29.aspx
             *
             * <h5><b>Example:</b></h5>
             * If the path value equals: ```/tree/node/index.html```<br/>
             * The result will be: ```['/','tree/','node/','index.html']```
             * @returns {string[]}
             */
            get: function () {
                return this.path.match(/^[/]|[^/]*[/]|[^/]+$/g);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Creates a writable copy.
         * @returns {IUri}
         */
        Uri.prototype.toMap = function () {
            return this.copyTo({});
        };
        /**
         * @returns {string} The full absolute uri.
         */
        Uri.prototype.toString = function () {
            return this.absoluteUri;
        };
        /**
         * Properly converts an existing URI to a string.
         * @param uri
         * @returns {string}
         */
        Uri.toString = function (uri) {
            return uri instanceof Uri
                ? uri.absoluteUri
                : uriToString(uri);
        };
        /**
         * Returns the authority segment of an URI.
         * @param uri
         * @returns {string}
         */
        Uri.getAuthority = function (uri) {
            return getAuthority(uri);
        };
        return Uri;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Uri;
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
        var i = 0, field;
        if (!to)
            to = {};
        while (field = Fields[i++]) {
            var value = from[field];
            if (value)
                to[field] = value;
        }
        return to;
    }
    var SLASH = '/', SLASH2 = '//', QM = '?', HASH = '#', EMPTY = '', AT = '@';
    function getScheme(scheme) {
        var s = scheme;
        if (Types_1.default.isString(s)) {
            if (!s)
                return undefined;
            s = Scheme_1.default[Utility_1.trim(s).toLowerCase().replace(/[^a-z0-9+.-]+$/g, EMPTY)];
            if (isNaN(s))
                throw new ArgumentOutOfRangeException_1.default('scheme', scheme, 'Invalid scheme.');
        }
        if (Types_1.default.isNumber(s, false)) {
            s = Scheme_1.default[s];
            if (!s)
                throw new ArgumentOutOfRangeException_1.default('scheme', scheme, 'Invalid scheme.');
            return s;
        }
        return undefined;
    }
    function getAuthority(uri) {
        if (!uri.host) {
            if (uri.userInfo)
                throw new ArgumentException_1.default('host', 'Cannot include user info when there is no host.');
            if (Types_1.default.isNumber(uri.port, false))
                throw new ArgumentException_1.default('host', 'Cannot include a port when there is no host.');
        }
        /*
         * [//[user:password@]host[:port]]
         */
        var result = uri.host || EMPTY;
        if (result) {
            if (uri.userInfo)
                result = uri.userInfo + AT + result;
            if (!isNaN(uri.port))
                result += ':' + uri.port;
            result = SLASH2 + result;
        }
        return result;
    }
    function formatQuery(query) {
        return query && ((query.indexOf(QM) == -1 ? QM : EMPTY) + query);
    }
    function formatFragment(fragment) {
        return fragment && ((fragment.indexOf(HASH) == -1 ? HASH : EMPTY) + fragment);
    }
    function getPathAndQuery(uri) {
        var path = uri.path, query = uri.query;
        return EMPTY
            + (path && ((path.indexOf(SLASH) == -1 ? SLASH : EMPTY) + path) || EMPTY)
            + (formatQuery(query) || EMPTY);
    }
    function uriToString(uri) {
        // scheme:[//[user:password@]domain[:port]][/]path[?query][#fragment]
        // {scheme}{authority}{path}{query}{fragment}
        var scheme = getScheme(uri.scheme), authority = getAuthority(uri), pathAndQuery = getPathAndQuery(uri), fragment = formatFragment(uri.fragment);
        return EMPTY
            + ((scheme && (scheme + ':')) || EMPTY)
            + (authority || EMPTY)
            + (pathAndQuery || EMPTY)
            + (fragment || EMPTY);
    }
    function tryParse(url, out) {
        if (!url)
            return new ArgumentException_1.default('url', 'Nothing to parse.');
        // Could use a regex here, but well follow some rules instead.
        // The intention is to 'gather' the pieces.  This isn't validation (yet).
        // scheme:[//[user:password@]domain[:port]][/]path[?query][#fragment]
        var i, result = {};
        // Anything after the first # is the fragment.
        i = url.indexOf(HASH);
        if (i != -1) {
            result.fragment = url.substring(i);
            url = url.substring(0, i);
        }
        // Anything after the first ? is the query.
        i = url.indexOf(QM);
        if (i != -1) {
            result.query = url.substring(i);
            url = url.substring(0, i);
        }
        // Guarantees a separation.
        i = url.indexOf(SLASH2);
        if (i != -1) {
            var scheme = Utility_1.trim(url.substring(0, i)), c = /:$/;
            if (!c.test(scheme))
                return new ArgumentException_1.default('url', 'Scheme was improperly formatted');
            scheme = Utility_1.trim(scheme.replace(c, EMPTY));
            try {
                result.scheme = getScheme(scheme) || undefined;
            }
            catch (ex) {
                return ex;
            }
            url = url.substring(i + 2);
        }
        // Find any path information.
        i = url.indexOf(SLASH);
        if (i != -1) {
            result.path = url.substring(i) || undefined;
            url = url.substring(0, i);
        }
        // Separate user info.
        i = url.indexOf(AT);
        if (i != -1) {
            result.userInfo = url.substring(0, i) || undefined;
            url = url.substring(i + 1);
        }
        // Remaining is host and port.
        i = url.indexOf(':');
        if (i != -1) {
            var port = parseInt(Utility_1.trim(url.substring(i + 1)));
            if (isNaN(port))
                return new ArgumentException_1.default('url', 'Port was invalid.');
            result.port = port;
            url = url.substring(0, i);
        }
        url = Utility_1.trim(url);
        if (url)
            result.host = url;
        out(copyUri(result));
        // null is good! (here)
        return null;
    }
});
//# sourceMappingURL=Uri.js.map