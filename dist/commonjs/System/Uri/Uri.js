/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based on: https://en.wikipedia.org/wiki/Uniform_Resource_Identifier
 */
"use strict";
var Types_1 = require("../Types");
var QueryParams = require("./QueryParams");
var QueryParam = require("./QueryParam");
var Scheme = require("./Scheme");
var Utility_1 = require("../Text/Utility");
var Exception_1 = require("../Exception");
var ArgumentException_1 = require("../Exceptions/ArgumentException");
var ArgumentOutOfRangeException_1 = require("../Exceptions/ArgumentOutOfRangeException");
var VOID0 = void (0);
var Uri = (function () {
    function Uri() {
        this.readonly = scheme;
        this.SchemeValue =  | null;
        this.readonly = userInfo;
    }
    return Uri;
}());
exports.Uri = Uri;
string | null;
readonly;
host: string | null;
readonly;
port: number | null;
readonly;
path: string | null;
readonly;
query: string | null;
readonly;
fragment: string | null;
readonly;
queryParams: IMap();
constructor(scheme, SchemeValue | null, userInfo, string | null, host, string | null, port, number | null, path, string | null, query ?  : QueryParam.Convertible, fragment ?  : string);
{
    var _ = this;
    this.scheme = getScheme(scheme) || null;
    this.userInfo = userInfo || null;
    this.host = host || null;
    this.port = getPort(port);
    this.authority = _.getAuthority() || null;
    this.path = path || null;
    if (!Types_1.Type.isString(query))
        query = QueryParams.encode(query);
    this.query = formatQuery(query) || null;
    Object.freeze(this.queryParams
        = _.query
            ? QueryParams.parseToMap(_.query)
            : {});
    this.pathAndQuery = _.getPathAndQuery() || null;
    this.fragment = formatFragment(fragment) || null;
    this.absoluteUri = _.getAbsoluteUri();
    this.baseUri = _.absoluteUri.replace(/[?#].*/, '');
    Object.freeze(this);
}
equals(other, IUri);
boolean;
{
    return this === other || this.absoluteUri == Uri.toString(other);
}
from(uri, string | IUri | null | undefined, defaults ?  : IUri);
Uri;
{
    var u = Types_1.Type.isString(uri)
        ? Uri.parse(uri)
        : uri;
    return new Uri(u && u.scheme || defaults && defaults.scheme, u && u.userInfo || defaults && defaults.userInfo, u && u.host || defaults && defaults.host, u && Types_1.Type.isNumber(u.port) ? u.port : defaults && defaults.port, u && u.path || defaults && defaults.path, u && u.query || defaults && defaults.query, u && u.fragment || defaults && defaults.fragment);
}
parse(url, string);
IUri;
parse(url, string, throwIfInvalid, boolean);
IUri | null;
parse(url, string, throwIfInvalid, boolean = true);
IUri | null;
{
    var result = null = null;
    var ex = tryParse(url, function (out) { result = out; });
    if (throwIfInvalid && ex)
        throw ex;
    return result;
}
tryParse(url, string, out, function (result) { return void ; });
boolean;
{
    return !tryParse(url, out);
}
copyOf(map, IUri);
IUri;
{
    return copyUri(map);
}
copyTo(map, IUri);
IUri;
{
    return copyUri(this, map);
}
updateQuery(query, QueryParam.Convertible);
Uri;
{
    var map = this.toMap();
    map.query = query;
    return Uri.from(map);
}
getAbsoluteUri();
string;
{
    return uriToString(this);
}
getAuthority();
string;
{
    return getAuthority(this);
}
getPathAndQuery();
string;
{
    return getPathAndQuery(this);
}
absoluteUri: string;
readonly;
authority: string | null;
readonly;
pathAndQuery: string | null;
readonly;
baseUri: string;
get;
pathSegments();
string[];
{
    return this.path
        && this.path.match(/^[/]|[^/]*[/]|[^/]+$/g)
        || [];
}
toMap();
IUri;
{
    return this.copyTo({});
}
toString();
string;
{
    return this.absoluteUri;
}
toString(uri, IUri);
string;
{
    return uri instanceof Uri
        ? uri.absoluteUri
        : uriToString(uri);
}
getAuthority(uri, IUri);
string;
{
    return getAuthority(uri);
}
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
var SLASH = '/', SLASH2 = '//', QM = QueryParams.Separator.Query, HASH = '#', EMPTY = '', AT = '@';
null;
{
    var s = scheme;
    if (Types_1.Type.isString(s)) {
        if (!s)
            return null;
        s = Utility_1.trim(s)
            .toLowerCase()
            .replace(/[^a-z0-9+.-]+$/g, EMPTY);
        if (!s)
            return null;
        if (Scheme.isValid(s))
            return s;
    }
    else {
        if (s === null || s === undefined)
            return s;
    }
    throw new ArgumentOutOfRangeException_1.ArgumentOutOfRangeException('scheme', scheme, 'Invalid scheme.');
}
null;
{
    if (port === 0)
        return port;
    if (!port)
        return null;
    var p;
    if (Types_1.Type.isNumber(port, true)) {
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
        if (Types_1.Type.isNumber(uri.port, false))
            throw new ArgumentException_1.ArgumentException('host', 'Cannot include a port when there is no host.');
    }
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
null | undefined;
{
    return query && ((query.indexOf(QM) !== 0 ? QM : EMPTY) + query);
}
null | undefined;
{
    return fragment && ((fragment.indexOf(HASH) !== 0 ? HASH : EMPTY) + fragment);
}
function getPathAndQuery(uri) {
    var path = uri.path, query = uri.query;
    return EMPTY
        + (path || EMPTY)
        + (formatQuery(query) || EMPTY);
}
function uriToString(uri) {
    var scheme = getScheme(uri.scheme), authority = getAuthority(uri), pathAndQuery = getPathAndQuery(uri), fragment = formatFragment(uri.fragment);
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
null | Exception_1.Exception;
{
    if (!url)
        return new ArgumentException_1.ArgumentException('url', 'Nothing to parse.');
    var i, result = {};
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
        var scheme = Utility_1.trim(url.substring(0, i)), c = /:$/;
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
        if (isNaN(port))
            return new ArgumentException_1.ArgumentException('url', 'Port was invalid.');
        result.port = port;
        url = url.substring(0, i);
    }
    url = Utility_1.trim(url);
    if (url)
        result.host = url;
    out(copyUri(result));
    return null;
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Uri;
//# sourceMappingURL=Uri.js.map