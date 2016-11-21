"use strict";
/**
 * The resource is a file on the local computer.
 */
exports.File = "file";
/**
 * The resource is accessed through FTP.
 */
exports.FTP = "ftp";
/**
 * The resource is accessed through the Gopher protocol.
 */
exports.GOPHER = "gopher";
/**
 * The resource is accessed through HTTP.
 */
exports.HTTP = "http";
/**
 * The resource is accessed through SSL-encrypted HTTP.
 */
exports.HTTPS = "https";
/**
 * The resource is accessed through the LDAP protocol.
 */
exports.LDAP = "ldap";
/**
 * The resource is an e-mail address and accessed through the SMTP protocol.
 */
exports.MAILTO = "mailto";
/**
 * The resource is accessed through a named pipe.
 */
exports.PIPE = "net.pipe";
/**
 * The resource is accessed from TCP endpoint.
 */
exports.TCP = "net.tcp";
/**
 * The resource is accessed through the NNTP protocol.
 */
exports.NEWS = "news";
/**
 * The resource is accessed through the NNTP protocol.
 */
exports.NNTP = "nntp";
/**
 * The resource is accessed through the TELNET protocol.
 */
exports.TELNET = "telnet";
/**
 * The resource is accessed through a unique UUID endpoint name for communicating with a service.
 */
exports.UUID = "uuid";
/**
 * An index of possible values to validate against.
 * @type {Array}
 */
exports.All = Object.freeze([
    exports.File, exports.FTP, exports.GOPHER, exports.HTTP, exports.HTTPS, exports.LDAP, exports.MAILTO, exports.PIPE, exports.TCP, exports.NEWS, exports.NNTP, exports.TELNET, exports.UUID
]);
function isValid(scheme) {
    return exports.All.indexOf(scheme) != -1;
}
exports.isValid = isValid;
//# sourceMappingURL=Scheme.js.map