(function (dependencies, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(dependencies, factory);
    }
})(["require", "exports"], function (require, exports) {
    "use strict";
    var Scheme;
    (function (Scheme) {
        Scheme.File = "file";
        Scheme.FTP = "ftp";
        Scheme.GOPHER = "gopher";
        Scheme.HTTP = "http";
        Scheme.HTTPS = "https";
        Scheme.LDAP = "ldap";
        Scheme.MAILTO = "mailto";
        Scheme.PIPE = "net.pipe";
        Scheme.TCP = "net.tcp";
        Scheme.NEWS = "news";
        Scheme.NNTP = "nntp";
        Scheme.TELNET = "telnet";
        Scheme.UUID = "uuid";
        Scheme.All = Object.freeze([
            Scheme.File, Scheme.FTP, Scheme.GOPHER, Scheme.HTTP, Scheme.HTTPS, Scheme.LDAP, Scheme.MAILTO, Scheme.PIPE, Scheme.TCP, Scheme.NEWS, Scheme.NNTP, Scheme.TELNET, Scheme.UUID
        ]);
        function isValid(scheme) {
            return Scheme.All.indexOf(scheme) != -1;
        }
        Scheme.isValid = isValid;
    })(Scheme = exports.Scheme || (exports.Scheme = {}));
    Object.freeze(Scheme);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Scheme;
});
//# sourceMappingURL=Scheme.js.map