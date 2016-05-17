/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based on: https://msdn.microsoft.com/en-us/library/system.uri.scheme%28v=vs.110%29.aspx
 */
System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Scheme, PIPE, TCP;
    return {
        setters:[],
        execute: function() {
            (function (Scheme) {
                Scheme[Scheme["file"] = 0] = "file";
                Scheme[Scheme["ftp"] = 1] = "ftp";
                Scheme[Scheme["gopher"] = 2] = "gopher";
                Scheme[Scheme["http"] = 3] = "http";
                Scheme[Scheme["https"] = 4] = "https";
                Scheme[Scheme["ldap"] = 5] = "ldap";
                Scheme[Scheme["mailto"] = 6] = "mailto";
                Scheme[Scheme["pipe"] = 7] = "pipe";
                Scheme[Scheme["tcp"] = 8] = "tcp";
                Scheme[Scheme["news"] = 9] = "news";
                Scheme[Scheme["nntp"] = 10] = "nntp";
                Scheme[Scheme["telnet"] = 11] = "telnet";
                Scheme[Scheme["uuid"] = 12] = "uuid";
            })(Scheme || (Scheme = {}));
            PIPE = 'net.pipe';
            TCP = 'net.tcp';
            Scheme[Scheme.pipe] = PIPE;
            Scheme[Scheme.tcp] = TCP;
            Scheme[PIPE] = Scheme.pipe;
            Scheme[TCP] = Scheme.tcp;
            Object.freeze(Scheme);
            exports_1("default",Scheme);
        }
    }
});
//# sourceMappingURL=Scheme.js.map