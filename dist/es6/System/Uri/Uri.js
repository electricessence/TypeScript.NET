/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based on: https://en.wikipedia.org/wiki/Uniform_Resource_Identifier
 */
import Type from '../Types';
import * as QueryParams from '../Uri/QueryParams';
import UriScheme from '../Uri/Scheme';
import ArgumentException from '../Exceptions/ArgumentException';
import ArgumentOutOfRangeException from '../Exceptions/ArgumentOutOfRangeException';
export default class Uri {
    constructor(scheme, userInfo, host, port, path, query, fragment) {
        var _ = this;
        _.scheme = getScheme(scheme) || null;
        _.userInfo = userInfo || null;
        _.host = host || null;
        _.port = port;
        _.path = path || null;
        if (!Type.isString(query))
            query = QueryParams.encode(query);
        _.query = formatQuery(query) || null;
        _.fragment = formatFragment(fragment) || null;
        _.absoluteUri = _.getAbsoluteUri();
        _.authority = _.getAuthority() || null;
        _.pathAndQuery = _.getPathAndQuery() || null;
        Object.freeze(_.queryParams
            = _.query
                ? QueryParams.parseToMap(_.query)
                : {});
        Object.freeze(_);
    }
    equals(other) {
        return this.absoluteUri == Uri.toString(other);
    }
    static from(url) {
        var uri = (!url || Type.isString(url))
            ? Uri.parse(url) : url;
        return new Uri(uri.scheme, uri.userInfo, uri.host, uri.port, uri.path, uri.query, uri.fragment);
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
    copyTo(map) {
        var _ = this;
        if (_.scheme)
            map.scheme = _.scheme;
        if (_.userInfo)
            map.userInfo = _.userInfo;
        if (_.host)
            map.host = _.host;
        if (_.port)
            map.port = _.port;
        if (_.path)
            map.path = _.path;
        if (_.query)
            map.query = _.query;
        if (_.fragment)
            map.fragment = _.fragment;
        return map;
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
const SLASH = '/', SLASH2 = '//', QM = '?', HASH = '#', EMPTY = '', AT = '@';
function trim(source) {
    return source.replace(/^\s+|\s+$/g, EMPTY);
}
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
        if (!isNaN(uri.port))
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
        var port = parseInt(trim(url.substring(i + 1)));
        if (isNaN(port))
            return new ArgumentException('url', 'Port was invalid.');
        result.port = port;
        url = url.substring(0, i);
    }
    result.host = trim(url) || undefined;
    out(result);
    return null;
}
//# sourceMappingURL=Uri.js.map