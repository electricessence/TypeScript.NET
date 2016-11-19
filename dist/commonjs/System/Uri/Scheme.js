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
//# sourceMappingURL=Scheme.js.map