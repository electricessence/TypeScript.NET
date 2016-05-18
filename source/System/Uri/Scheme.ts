/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based on: https://msdn.microsoft.com/en-us/library/system.uri.scheme%28v=vs.110%29.aspx
 */

import * as Scheme from "./SchemeValue";
import {SchemeValue} from "./SchemeValue";


/**
 * The resource is a file on the local computer.
 */
export const File:Scheme.File = "file";


/**
 * The resource is accessed through FTP.
 */
export const FTP:Scheme.FTP = "ftp";


/**
 * The resource is accessed through the Gopher protocol.
 */
export const GOPHER:Scheme.Gopher = "gopher";


/**
 * The resource is accessed through HTTP.
 */
export const HTTP:Scheme.HTTP = "http";


/**
 * The resource is accessed through SSL-encrypted HTTP.
 */
export const HTTPS:Scheme.HTTPS = "https";


/**
 * The resource is accessed through the LDAP protocol.
 */
export const LDAP:Scheme.LDAP = "ldap";


/**
 * The resource is an e-mail address and accessed through the SMTP protocol.
 */
export const MAILTO:Scheme.MailTo = "mailto";


/**
 * The resource is accessed through a named pipe.
 */
export const PIPE:Scheme.Pipe = "net.pipe";


/**
 * The resource is accessed from TCP endpoint.
 */
export const TCP:Scheme.TCP = "net.tcp";


/**
 * The resource is accessed through the NNTP protocol.
 */
export const NEWS:Scheme.NNTP = "news";


/**
 * The resource is accessed through the NNTP protocol.
 */
export const NNTP:Scheme.NNTP = "nntp";


/**
 * The resource is accessed through the TELNET protocol.
 */
export const TELNET:Scheme.Telnet = "telnet";

/**
 * The resource is accessed through a unique UUID endpoint name for communicating with a service.
 */
export const UUID:Scheme.UUID = "uuid";

/**
 * An index of possible values to validate against.
 * @type {Array}
 */
export const All:SchemeValue[] = Object.freeze([
	File, FTP, GOPHER, HTTP, HTTPS, LDAP, MAILTO, PIPE, TCP, NEWS, NNTP, TELNET, UUID
]);

export function isValid(scheme:string):scheme is SchemeValue {
	return All.indexOf(<any>scheme)!=-1;
}
