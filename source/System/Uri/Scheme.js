/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based on: https://msdn.microsoft.com/en-us/library/system.uri.scheme%28v=vs.110%29.aspx
 */
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    exports.File = "file";
    exports.FTP = "ftp";
    exports.GOPHER = "gopher";
    exports.HTTP = "http";
    exports.HTTPS = "https";
    exports.LDAP = "ldap";
    exports.MAILTO = "mailto";
    exports.PIPE = "net.pipe";
    exports.TCP = "net.tcp";
    exports.NEWS = "news";
    exports.NNTP = "nntp";
    exports.TELNET = "telnet";
    exports.UUID = "uuid";
    exports.All = Object.freeze([
        exports.File, exports.FTP, exports.GOPHER, exports.HTTP, exports.HTTPS, exports.LDAP, exports.MAILTO, exports.PIPE, exports.TCP, exports.NEWS, exports.NNTP, exports.TELNET, exports.UUID
    ]);
    function isValid(scheme) {
        return exports.All.indexOf(scheme) != -1;
    }
    exports.isValid = isValid;
});
//# sourceMappingURL=Scheme.js.map