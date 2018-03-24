/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based on: https://msdn.microsoft.com/en-us/library/system.uri.scheme%28v=vs.110%29.aspx
 */
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Scheme;
    (function (Scheme) {
        Scheme["File"] = "file";
        Scheme["Gopher"] = "gopher";
        Scheme["FTP"] = "ftp";
        Scheme["HTTP"] = "http";
        Scheme["HTTPS"] = "https";
        Scheme["LDAP"] = "ldap";
        Scheme["MailTo"] = "mailto";
        Scheme["Pipe"] = "net.pipe";
        Scheme["TCP"] = "net.tcp";
        Scheme["NNTP"] = "nntp";
        Scheme["News"] = "news";
        Scheme["Telnet"] = "telnet";
        Scheme["UUID"] = "uuid";
    })(Scheme || (Scheme = {}));
    function isValidScheme(scheme) {
        if (!scheme)
            return false;
        scheme = scheme.toLowerCase();
        var s = Scheme;
        for (var _i = 0, _a = Object.keys(s); _i < _a.length; _i++) {
            var key = _a[_i];
            if (s[key] == scheme)
                return true;
        }
        return false;
    }
    exports.isValidScheme = isValidScheme;
    exports.default = Scheme;
});
//# sourceMappingURL=Scheme.js.map