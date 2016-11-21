/**
 * The resource is a file on the local computer.
 */
export const File = "file";
/**
 * The resource is accessed through FTP.
 */
export const FTP = "ftp";
/**
 * The resource is accessed through the Gopher protocol.
 */
export const GOPHER = "gopher";
/**
 * The resource is accessed through HTTP.
 */
export const HTTP = "http";
/**
 * The resource is accessed through SSL-encrypted HTTP.
 */
export const HTTPS = "https";
/**
 * The resource is accessed through the LDAP protocol.
 */
export const LDAP = "ldap";
/**
 * The resource is an e-mail address and accessed through the SMTP protocol.
 */
export const MAILTO = "mailto";
/**
 * The resource is accessed through a named pipe.
 */
export const PIPE = "net.pipe";
/**
 * The resource is accessed from TCP endpoint.
 */
export const TCP = "net.tcp";
/**
 * The resource is accessed through the NNTP protocol.
 */
export const NEWS = "news";
/**
 * The resource is accessed through the NNTP protocol.
 */
export const NNTP = "nntp";
/**
 * The resource is accessed through the TELNET protocol.
 */
export const TELNET = "telnet";
/**
 * The resource is accessed through a unique UUID endpoint name for communicating with a service.
 */
export const UUID = "uuid";
/**
 * An index of possible values to validate against.
 * @type {Array}
 */
export const All = Object.freeze([
    File, FTP, GOPHER, HTTP, HTTPS, LDAP, MAILTO, PIPE, TCP, NEWS, NNTP, TELNET, UUID
]);
export function isValid(scheme) {
    return All.indexOf(scheme) != -1;
}
//# sourceMappingURL=Scheme.js.map