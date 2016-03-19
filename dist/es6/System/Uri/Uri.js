/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based on: https://en.wikipedia.org/wiki/Uniform_Resource_Identifier
 */
'use strict';
import Type from '../Types';
import * as QueryParams from '../Uri/QueryParams';
import { trim } from '../Text/Utility';
import UriScheme from '../Uri/Scheme';
import ArgumentException from '../Exceptions/ArgumentException';
import ArgumentOutOfRangeException from '../Exceptions/ArgumentOutOfRangeException';
export default class Uri {
    constructor(scheme, userInfo, host, port, path, query, fragment) {
        var _ = this;
        _.scheme = getScheme(scheme) || null;
        _.userInfo = userInfo || null;
        _.host = host || null;
        _.port = port || null;
        _.authority = _.getAuthority() || null;
        _.path = path || null;
        if (!Type.isString(query))
            query = QueryParams.encode(query);
        _.query = formatQuery(query) || null;
        Object.freeze(_.queryParams
            = _.query
                ? QueryParams.parseToMap(_.query)
                : {});
        _.pathAndQuery = _.getPathAndQuery() || null;
        _.fragment = formatFragment(fragment) || null;
        _.absoluteUri = _.getAbsoluteUri();
        _.baseUri = _.absoluteUri.replace(/[?#].*/, '');
        Object.freeze(_);
    }
    equals(other) {
        return this === other || this.absoluteUri == Uri.toString(other);
    }
    static from(uri, defaults) {
        var u = (!uri || Type.isString(uri))
            ? Uri.parse(uri) : uri;
        return new Uri(u.scheme || defaults && defaults.scheme, u.userInfo || defaults && defaults.userInfo, u.host || defaults && defaults.host, isNaN(u.port) ? defaults && defaults.port : u.port, u.path || defaults && defaults.path, u.query || defaults && defaults.query, u.fragment || defaults && defaults.fragment);
    }
    static parse(url, throwIfInvalid = true) {
        var result = null;
        var ex = tryParse(url, (out) => { result = out; });
        if (throwIfInvalid && ex)
            throw ex;
        return result;
    }
    static tryParse(url, out) {
        return !tryParse(url, out);
    }
    static copyOf(map) {
        return copyUri(map);
    }
    copyTo(map) {
        return copyUri(this, map);
    }
    updateQuery(query) {
        var map = this.toMap();
        map.query = query;
        return Uri.from(map);
    }
    getAbsoluteUri() {
        return uriToString(this);
    }
    getAuthority() {
        return getAuthority(this);
    }
    getPathAndQuery() {
        return getPathAndQuery(this);
    }
    get pathSegments() {
        return this.path.match(/^[/]|[^/]*[/]|[^/]+$/g);
    }
    toMap() {
        return this.copyTo({});
    }
    toString() {
        return this.absoluteUri;
    }
    static toString(uri) {
        return uri instanceof Uri
            ? uri.absoluteUri
            : uriToString(uri);
    }
    static getAuthority(uri) {
        return getAuthority(uri);
    }
}
export var Fields;
(function (Fields) {
    Fields[Fields["scheme"] = 0] = "scheme";
    Fields[Fields["userInfo"] = 1] = "userInfo";
    Fields[Fields["host"] = 2] = "host";
    Fields[Fields["port"] = 3] = "port";
    Fields[Fields["path"] = 4] = "path";
    Fields[Fields["query"] = 5] = "query";
    Fields[Fields["fragment"] = 6] = "fragment";
})(Fields || (Fields = {}));
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
const SLASH = '/', SLASH2 = '//', QM = '?', HASH = '#', EMPTY = '', AT = '@';
function getScheme(scheme) {
    var s = scheme;
    if (Type.isString(s)) {
        if (!s)
            return undefined;
        s = UriScheme[trim(s).toLowerCase().replace(/[^a-z0-9+.-]+$/g, EMPTY)];
        if (isNaN(s))
            throw new ArgumentOutOfRangeException('scheme', scheme, 'Invalid scheme.');
    }
    if (Type.isNumber(s, false)) {
        s = UriScheme[s];
        if (!s)
            throw new ArgumentOutOfRangeException('scheme', scheme, 'Invalid scheme.');
        return s;
    }
    return undefined;
}
function getAuthority(uri) {
    if (!uri.host) {
        if (uri.userInfo)
            throw new ArgumentException('host', 'Cannot include user info when there is no host.');
        if (Type.isNumber(uri.port, false))
            throw new ArgumentException('host', 'Cannot include a port when there is no host.');
    }
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
    var scheme = getScheme(uri.scheme), authority = getAuthority(uri), pathAndQuery = getPathAndQuery(uri), fragment = formatFragment(uri.fragment);
    return EMPTY
        + ((scheme && (scheme + ':')) || EMPTY)
        + (authority || EMPTY)
        + (pathAndQuery || EMPTY)
        + (fragment || EMPTY);
}
function tryParse(url, out) {
    if (!url)
        return new ArgumentException('url', 'Nothing to parse.');
    var i, result = {};
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
        var scheme = trim(url.substring(0, i)), c = /:$/;
        if (!c.test(scheme))
            return new ArgumentException('url', 'Scheme was improperly formatted');
        scheme = trim(scheme.replace(c, EMPTY));
        try {
            result.scheme = getScheme(scheme) || undefined;
        }
        catch (ex) {
            return ex;
        }
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
        var port = parseInt(trim(url.substring(i + 1)));
        if (isNaN(port))
            return new ArgumentException('url', 'Port was invalid.');
        result.port = port;
        url = url.substring(0, i);
    }
    url = trim(url);
    if (url)
        result.host = url;
    out(copyUri(result));
    return null;
}
//# sourceMappingURL=Uri.js.map