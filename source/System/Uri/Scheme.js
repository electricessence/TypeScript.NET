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
    // TODO: Possibly use string literals instead.
    var Scheme;
    (function (Scheme) {
        /**
         * The resource is a file on the local computer.
         */
        Scheme[Scheme["file"] = 0] = "file";
        /**
         * The resource is accessed through FTP.
         */
        Scheme[Scheme["ftp"] = 1] = "ftp";
        /**
         * The resource is accessed through the Gopher protocol.
         */
        Scheme[Scheme["gopher"] = 2] = "gopher";
        /**
         * The resource is accessed through HTTP.
         */
        Scheme[Scheme["http"] = 3] = "http";
        /**
         * The resource is accessed through SSL-encrypted HTTP.
         */
        Scheme[Scheme["https"] = 4] = "https";
        /**
         * The resource is accessed through the LDAP protocol.
         */
        Scheme[Scheme["ldap"] = 5] = "ldap";
        /**
         * The resource is an e-mail address and accessed through the SMTP protocol.
         */
        Scheme[Scheme["mailto"] = 6] = "mailto";
        /**
         * The resource is accessed through a named pipe.
         */
        Scheme[Scheme["pipe"] = 7] = "pipe";
        /**
         * The resource is accessed from TCP endpoint.
         */
        Scheme[Scheme["tcp"] = 8] = "tcp";
        /**
         * The resource is accessed through the NNTP protocol.
         */
        Scheme[Scheme["news"] = 9] = "news";
        /**
         * The resource is accessed through the NNTP protocol.
         */
        Scheme[Scheme["nntp"] = 10] = "nntp";
        /**
         * The resource is accessed through the TELNET protocol.
         */
        Scheme[Scheme["telnet"] = 11] = "telnet";
        /**
         * The resource is accessed through a unique UUID endpoint name for communicating with a service.
         */
        Scheme[Scheme["uuid"] = 12] = "uuid";
    })(Scheme || (Scheme = {}));
    // Extend the usefulness of the enum.
    var PIPE = 'net.pipe';
    var TCP = 'net.tcp';
    Scheme[Scheme.pipe] = PIPE;
    Scheme[Scheme.tcp] = TCP;
    Scheme[PIPE] = Scheme.pipe;
    Scheme[TCP] = Scheme.tcp;
    Object.freeze(Scheme);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Scheme;
});
//# sourceMappingURL=Scheme.js.map