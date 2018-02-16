"use strict";
/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based on: https://en.wikipedia.org/wiki/Uniform_Resource_Identifier
 */
Object.defineProperty(exports, "__esModule", { value: true });
var Types_1 = require("../Types");
var Scheme_1 = require("./Scheme");
var QueryParams_1 = require("./QueryParams");
var Utility_1 = require("../Text/Utility");
var ArgumentException_1 = require("../Exceptions/ArgumentException");
var ArgumentOutOfRangeException_1 = require("../Exceptions/ArgumentOutOfRangeException");
var VOID0 = void 0;
/**
 * Provides an read-only model representation of a uniform resource identifier (URI) and easy access to the parts of the URI.
 *
 * The read-only model (frozen) is easier for debugging than exposing accessors for each property.
 * ICloneable&lt;Uri&gt; is not used to prevent unnecessary copying of values that won't change.
 */
var Uri = /** @class */ (function () {
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
        this.scheme = getScheme(scheme) || null;
        this.userInfo = userInfo || null;
        this.host = host || null;
        this.port = getPort(port);
        this.authority = _.getAuthority() || null;
        this.path = path || null;
        if (!Types_1.Type.isString(query))
            query = QueryParams_1.encode(query);
        this.query = formatQuery(query) || null;
        Object.freeze(this.queryParams
            = _.query
                ? QueryParams_1.parseToMap(_.query)
                : {});
        this.pathAndQuery = _.getPathAndQuery() || null;
        this.fragment = formatFragment(fragment) || null;
        // This should validate the uri...
        this.absoluteUri = _.getAbsoluteUri();
        this.baseUri = _.absoluteUri.replace(/[?#].*/, '');
        // Intended to be read-only.  Call .toMap() to get a writable copy.
        Object.freeze(this);
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
        var u = Types_1.Type.isString(uri)
            ? Uri.parse(uri) // Parsing a string should throw errors.  Null or undefined simply means empty.
            : uri;
        return new Uri(u && u.scheme || defaults && defaults.scheme, u && u.userInfo || defaults && defaults.userInfo, u && u.host || defaults && defaults.host, u && Types_1.Type.isNumber(u.port, true) ? u.port : defaults && defaults.port, u && u.path || defaults && defaults.path, u && u.query || defaults && defaults.query, u && u.fragment || defaults && defaults.fragment);
    };
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
            return this.path
                && this.path.match(/^[/]|[^/]*[/]|[^/]+$/g)
                || [];
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
exports.Uri = Uri;
var Fields;
(function (Fields) {
    Fields[Fields["scheme"] = 0] = "scheme";
    Fields[Fields["userInfo"] = 1] = "userInfo";
    Fields[Fields["host"] = 2] = "host";
    Fields[Fields["port"] = 3] = "port";
    Fields[Fields["path"] = 4] = "path";
    Fields[Fields["query"] = 5] = "query";
    Fields[Fields["fragment"] = 6] = "fragment";
})(Fields = exports.Fields || (exports.Fields = {}));
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
var SLASH = '/', SLASH2 = '//', QM = QueryParams_1.Separator.Query, HASH = '#', EMPTY = '', AT = '@';
function getScheme(scheme) {
    var s = scheme;
    if (Types_1.Type.isString(s)) {
        if (!s)
            return null;
        s = Utility_1.trim(s)
            .toLowerCase()
            .replace(/[^a-z0-9+.-]+$/g, EMPTY);
        if (!s)
            return null;
        if (Scheme_1.Scheme.isValid(s))
            return s;
    }
    else {
        if (s == null)
            return s;
    }
    throw new ArgumentOutOfRangeException_1.ArgumentOutOfRangeException('scheme', scheme, 'Invalid scheme.');
}
function getPort(port) {
    if (port === 0)
        return port;
    if (!port)
        return null;
    var p;
    if (Types_1.Type.isNumber(port)) {
        p = port;
        if (p >= 0 && isFinite(p))
            return p;
    }
    else if (Types_1.Type.isString(port) && (p = parseInt(port)) && !isNaN(p)) {
        return getPort(p);
    }
    throw new ArgumentException_1.ArgumentException("port", "invalid value");
}
function getAuthority(uri) {
    if (!uri.host) {
        if (uri.userInfo)
            throw new ArgumentException_1.ArgumentException('host', 'Cannot include user info when there is no host.');
        if (Types_1.Type.isNumber(uri.port, true))
            throw new ArgumentException_1.ArgumentException('host', 'Cannot include a port when there is no host.');
    }
    /*
     * [//[user:password@]host[:port]]
     */
    var result = uri.host || EMPTY;
    if (result) {
        if (uri.userInfo)
            result = uri.userInfo + AT + result;
        if (!isNaN((uri.port)))
            result += ':' + uri.port;
        result = SLASH2 + result;
    }
    return result;
}
function formatQuery(query) {
    return query && ((query.indexOf(QM) !== 0 ? QM : EMPTY) + query);
}
function formatFragment(fragment) {
    return fragment && ((fragment.indexOf(HASH) !== 0 ? HASH : EMPTY) + fragment);
}
function getPathAndQuery(uri) {
    var path = uri.path, query = uri.query;
    return EMPTY
        + (path || EMPTY)
        + (formatQuery(query) || EMPTY);
}
function uriToString(uri) {
    // scheme:[//[user:password@]domain[:port]][/]path[?query][#fragment]
    // {scheme}{authority}{path}{query}{fragment}
    var scheme = getScheme(uri.scheme);
    var authority = getAuthority(uri);
    var pathAndQuery = getPathAndQuery(uri), fragment = formatFragment(uri.fragment);
    var part1 = EMPTY
        + ((scheme && (scheme + ':')) || EMPTY)
        + (authority || EMPTY);
    var part2 = EMPTY
        + (pathAndQuery || EMPTY)
        + (fragment || EMPTY);
    if (part1 && part2 && scheme && !authority)
        throw new ArgumentException_1.ArgumentException('authority', "Cannot format schemed Uri with missing authority.");
    if (part1 && pathAndQuery && pathAndQuery.indexOf(SLASH) !== 0)
        part2 = SLASH + part2;
    return part1 + part2;
}
function tryParse(url, out) {
    if (!url)
        return new ArgumentException_1.ArgumentException('url', 'Nothing to parse.');
    // Could use a regex here, but well follow some rules instead.
    // The intention is to 'gather' the pieces.  This isn't validation (yet).
    // scheme:[//[user:password@]domain[:port]][/]path[?query][#fragment]
    var i;
    var result = {};
    // Anything after the first # is the fragment.
    i = url.indexOf(HASH);
    if (i != -1) {
        result.fragment = url.substring(i + 1) || VOID0;
        url = url.substring(0, i);
    }
    // Anything after the first ? is the query.
    i = url.indexOf(QM);
    if (i != -1) {
        result.query = url.substring(i + 1) || VOID0;
        url = url.substring(0, i);
    }
    // Guarantees a separation.
    i = url.indexOf(SLASH2);
    if (i != -1) {
        var scheme = Utility_1.trim(url.substring(0, i));
        var c = /:$/;
        if (!c.test(scheme))
            return new ArgumentException_1.ArgumentException('url', 'Scheme was improperly formatted');
        scheme = Utility_1.trim(scheme.replace(c, EMPTY));
        try {
            result.scheme = getScheme(scheme) || VOID0;
        }
        catch (ex) {
            return ex;
        }
        url = url.substring(i + 2);
    }
    // Find any path information.
    i = url.indexOf(SLASH);
    if (i != -1) {
        result.path = url.substring(i);
        url = url.substring(0, i);
    }
    // Separate user info.
    i = url.indexOf(AT);
    if (i != -1) {
        result.userInfo = url.substring(0, i) || VOID0;
        url = url.substring(i + 1);
    }
    // Remaining is host and port.
    i = url.indexOf(':');
    if (i != -1) {
        var port = parseInt(Utility_1.trim(url.substring(i + 1)));
        if (isNaN(port))
            return new ArgumentException_1.ArgumentException('url', 'Port was invalid.');
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
exports.default = Uri;
//# sourceMappingURL=Uri.js.map