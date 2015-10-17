/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based on: https://msdn.microsoft.com/en-us/library/system.uri.scheme%28v=vs.110%29.aspx
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var UriScheme;
(function (UriScheme) {
    UriScheme[UriScheme["file"] = 0] = "file";
    UriScheme[UriScheme["ftp"] = 1] = "ftp";
    UriScheme[UriScheme["gopher"] = 2] = "gopher";
    UriScheme[UriScheme["http"] = 3] = "http";
    UriScheme[UriScheme["https"] = 4] = "https";
    UriScheme[UriScheme["ldap"] = 5] = "ldap";
    UriScheme[UriScheme["mailto"] = 6] = "mailto";
    UriScheme[UriScheme["pipe"] = 7] = "pipe";
    UriScheme[UriScheme["tcp"] = 8] = "tcp";
    UriScheme[UriScheme["news"] = 9] = "news";
    UriScheme[UriScheme["nntp"] = 10] = "nntp";
    UriScheme[UriScheme["telnet"] = 11] = "telnet";
    UriScheme[UriScheme["uuid"] = 12] = "uuid";
})(UriScheme || (UriScheme = {}));
var PIPE = 'net.pipe';
var TCP = 'net.tcp';
UriScheme[UriScheme.pipe] = PIPE;
UriScheme[UriScheme.tcp] = TCP;
UriScheme[PIPE] = UriScheme.pipe;
UriScheme[TCP] = UriScheme.tcp;
Object.freeze(UriScheme);
exports["default"] = UriScheme;
module.exports = exports["default"];
//# sourceMappingURL=Scheme.js.map
