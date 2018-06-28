/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based on: https://msdn.microsoft.com/en-us/library/system.UriHostNameType%28v=vs.110%29.aspx
 */
System.register([], function (exports_1, context_1) {
    "use strict";
    var UriHostNameType;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {/*!
             * @author electricessence / https://github.com/electricessence/
             * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
             * Based on: https://msdn.microsoft.com/en-us/library/system.UriHostNameType%28v=vs.110%29.aspx
             */
            (function (UriHostNameType) {
                /**
                 * The host is set, but the type cannot be determined.
                 */
                UriHostNameType[UriHostNameType["Basic"] = 0] = "Basic";
                /**
                 * The host name is a domain name system (DNS) style host name.
                 */
                UriHostNameType[UriHostNameType["DNS"] = 1] = "DNS";
                /**
                 * The host name is an Internet Protocol (IP) version 4 host address.
                 */
                UriHostNameType[UriHostNameType["IPv4"] = 2] = "IPv4";
                /**
                 * The host name is an Internet Protocol (IP) version 6 host address.
                 */
                UriHostNameType[UriHostNameType["IPv6"] = 3] = "IPv6";
                /**
                 * The type of the host name is not supplied.
                 */
                UriHostNameType[UriHostNameType["Unknown"] = 4] = "Unknown";
            })(UriHostNameType || (UriHostNameType = {}));
            exports_1("UriHostNameType", UriHostNameType);
            Object.freeze(UriHostNameType);
            exports_1("default", UriHostNameType);
        }
    };
});
//# sourceMappingURL=HostNameType.js.map