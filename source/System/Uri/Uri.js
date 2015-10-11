/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based on: https://en.wikipedia.org/wiki/Uniform_Resource_Identifier
 */
define(["require", "exports", '../Types', './Scheme', '../Exceptions/ArgumentException', '../Exceptions/ArgumentOutOfRangeException', './QueryParams'], function (require, exports, Types, UriScheme, ArgumentException, ArgumentOutOfRangeException, QueryParams) {
    var Uri = (function () {
        function Uri(scheme, userInfo, host, port, path, query, fragment) {
            var _ = this;
            _.scheme = getScheme(scheme);
            _.userInfo = userInfo;
            _.host = host;
            _.port = port;
            _.path = path;
            _.query = formatQuery(query);
            _.fragment = formatFragment(fragment);
            _.absoluteUri = _.getAbsoluteUri();
            _.authority = _.getAuthority();
            _.pathAndQuery = _.getPathAndQuery();
            Object.freeze(_.queryParams
                = query
                    ? QueryParams.parseToMap(query)
                    : {});
            Object.freeze(_);
        }
        Uri.from = function (uri) {
            return new Uri(uri.scheme, uri.userInfo, uri.host, uri.port, uri.path, uri.query, uri.fragment);
        };
        Uri.prototype.getAbsoluteUri = function () {
            return uriToString(this);
        };
        Uri.prototype.getAuthority = function () {
            return getAuthority(this);
        };
        Uri.prototype.getPathAndQuery = function () {
            return getPathAndQuery(this);
        };
        Object.defineProperty(Uri.prototype, "pathSegments", {
            get: function () {
                return this.path.match(/^[/]|[^/]*[/]|[^/]+$/g);
            },
            enumerable: true,
            configurable: true
        });
        Uri.prototype.toMap = function () {
            var _ = this;
            var map = {};
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
        };
        Uri.prototype.toString = function () {
            return this.absoluteUri;
        };
        Uri.toString = function (uri) {
            return uriToString(uri);
        };
        Uri.getAuthority = function (uri) {
            return getAuthority(uri);
        };
        return Uri;
    })();
    var SLASH = '/', QM = '?', HASH = '#';
    function getScheme(scheme) {
        var s = scheme;
        if (Types.isString(s)) {
            if (!s)
                return undefined;
            s = UriScheme[s.toLowerCase().replace(/^\s+|[^a-z.]+$/g, '')];
            if (isNaN(s))
                throw new ArgumentOutOfRangeException('scheme', scheme, 'Invalid scheme.');
        }
        if (Types.isNumber(s, false)) {
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
        var result = uri.host || '';
        if (result) {
            if (uri.userInfo)
                result = uri.userInfo + "@" + result;
            if (!isNaN(uri.port))
                result += ':' + uri.port;
            result = '//' + result;
        }
        return result;
    }
    function formatQuery(query) {
        return query && ((query.indexOf(QM) == -1 ? QM : '') + query);
    }
    function formatFragment(fragment) {
        return fragment && ((fragment.indexOf(HASH) == -1 ? HASH : '') + fragment);
    }
    function getPathAndQuery(uri) {
        var path = uri.path, query = uri.query;
        return ''
            + (path && ((path.indexOf(SLASH) == -1 ? SLASH : '') + path) || '')
            + (formatQuery(query) || '');
    }
    function uriToString(uri) {
        // scheme:[//[user:password@]domain[:port]][/]path[?query][#fragment]
        // {scheme}{authority}{path}{query}{fragment}
        var scheme = getScheme(uri.scheme), authority = getAuthority(uri), pathAndQuery = getPathAndQuery(uri), fragment = formatFragment(uri.fragment);
        return ''
            + ((scheme && (scheme + ':')) || '')
            + (authority || '')
            + (pathAndQuery || '')
            + (fragment || '');
    }
    return Uri;
});
//# sourceMappingURL=Uri.js.map