/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based on: https://msdn.microsoft.com/en-us/library/system.uri.scheme%28v=vs.110%29.aspx
 */
(function (deps, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(deps, factory);
    }
})(["require", "exports"], function (require, exports) {
    var UriScheme;
    (function (UriScheme) {
        /**
         * The resource is a file on the local computer.
         */
        UriScheme[UriScheme["file"] = 0] = "file";
        /**
         * The resource is accessed through FTP.
         */
        UriScheme[UriScheme["ftp"] = 1] = "ftp";
        /**
         * The resource is accessed through the Gopher protocol.
         */
        UriScheme[UriScheme["gopher"] = 2] = "gopher";
        /**
         * The resource is accessed through HTTP.
         */
        UriScheme[UriScheme["http"] = 3] = "http";
        /**
         * The resource is accessed through SSL-encrypted HTTP.
         */
        UriScheme[UriScheme["https"] = 4] = "https";
        /**
         * The resource is accessed through the LDAP protocol.
         */
        UriScheme[UriScheme["ldap"] = 5] = "ldap";
        /**
         * The resource is an e-mail address and accessed through the SMTP protocol.
         */
        UriScheme[UriScheme["mailto"] = 6] = "mailto";
        /**
         * The resource is accessed through a named pipe.
         */
        UriScheme[UriScheme["pipe"] = 7] = "pipe";
        /**
         * The resource is accessed from TCP endpoint.
         */
        UriScheme[UriScheme["tcp"] = 8] = "tcp";
        /**
         * The resource is accessed through the NNTP protocol.
         */
        UriScheme[UriScheme["news"] = 9] = "news";
        /**
         * The resource is accessed through the NNTP protocol.
         */
        UriScheme[UriScheme["nntp"] = 10] = "nntp";
        /**
         * The resource is accessed through the TELNET protocol.
         */
        UriScheme[UriScheme["telnet"] = 11] = "telnet";
        /**
         * The resource is accessed through a unique UUID endpoint name for communicating with a service.
         */
        UriScheme[UriScheme["uuid"] = 12] = "uuid";
    })(UriScheme || (UriScheme = {}));
    // Extend the usefulness of the enum.
    var PIPE = 'net.pipe';
    var TCP = 'net.tcp';
    UriScheme[UriScheme.pipe] = PIPE;
    UriScheme[UriScheme.tcp] = TCP;
    UriScheme[PIPE] = UriScheme.pipe;
    UriScheme[TCP] = UriScheme.tcp;
    Object.freeze(UriScheme);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = UriScheme;
});
//# sourceMappingURL=Scheme.js.map