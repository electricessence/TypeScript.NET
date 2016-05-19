/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based on: https://msdn.microsoft.com/en-us/library/system.uri.scheme%28v=vs.110%29.aspx
 */
export const File = "file";
export const FTP = "ftp";
export const GOPHER = "gopher";
export const HTTP = "http";
export const HTTPS = "https";
export const LDAP = "ldap";
export const MAILTO = "mailto";
export const PIPE = "net.pipe";
export const TCP = "net.tcp";
export const NEWS = "news";
export const NNTP = "nntp";
export const TELNET = "telnet";
export const UUID = "uuid";
export const All = Object.freeze([
    File, FTP, GOPHER, HTTP, HTTPS, LDAP, MAILTO, PIPE, TCP, NEWS, NNTP, TELNET, UUID
]);
export function isValid(scheme) {
    return All.indexOf(scheme) != -1;
}
//# sourceMappingURL=Scheme.js.map