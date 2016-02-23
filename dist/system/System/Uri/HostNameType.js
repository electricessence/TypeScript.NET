System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var UriHostNameType;
    return {
        setters:[],
        execute: function() {
            (function (UriHostNameType) {
                UriHostNameType[UriHostNameType["Basic"] = 0] = "Basic";
                UriHostNameType[UriHostNameType["DNS"] = 1] = "DNS";
                UriHostNameType[UriHostNameType["IPv4"] = 2] = "IPv4";
                UriHostNameType[UriHostNameType["IPv6"] = 3] = "IPv6";
                UriHostNameType[UriHostNameType["Unknown"] = 4] = "Unknown";
            })(UriHostNameType || (UriHostNameType = {}));
            Object.freeze(UriHostNameType);
            exports_1("default",UriHostNameType);
        }
    }
});
//# sourceMappingURL=HostNameType.js.map