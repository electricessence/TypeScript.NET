/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based on: https://msdn.microsoft.com/en-us/library/system.UriHostNameType%28v=vs.110%29.aspx
 */
"use strict";

(function (UriHostNameType) {
    UriHostNameType[UriHostNameType["Basic"] = 0] = "Basic";
    UriHostNameType[UriHostNameType["DNS"] = 1] = "DNS";
    UriHostNameType[UriHostNameType["IPv4"] = 2] = "IPv4";
    UriHostNameType[UriHostNameType["IPv6"] = 3] = "IPv6";
    UriHostNameType[UriHostNameType["Unknown"] = 4] = "Unknown";
})(exports.UriHostNameType || (exports.UriHostNameType = {}));
var UriHostNameType = exports.UriHostNameType;
Object.freeze(UriHostNameType);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = UriHostNameType;
//# sourceMappingURL=HostNameType.js.map
