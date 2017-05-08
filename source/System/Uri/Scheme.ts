/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based on: https://msdn.microsoft.com/en-us/library/system.uri.scheme%28v=vs.110%29.aspx
 */

import {SchemeValue} from "./SchemeValue";

export module Scheme {

	/**
	 * The resource is a file on the local computer.
	 */
	export const File:SchemeValue.File = "file";


	/**
	 * The resource is accessed through FTP.
	 */
	export const FTP:SchemeValue.FTP = "ftp";


	/**
	 * The resource is accessed through the Gopher protocol.
	 */
	export const GOPHER:SchemeValue.Gopher = "gopher";


	/**
	 * The resource is accessed through HTTP.
	 */
	export const HTTP:SchemeValue.HTTP = "http";


	/**
	 * The resource is accessed through SSL-encrypted HTTP.
	 */
	export const HTTPS:SchemeValue.HTTPS = "https";


	/**
	 * The resource is accessed through the LDAP protocol.
	 */
	export const LDAP:SchemeValue.LDAP = "ldap";


	/**
	 * The resource is an e-mail address and accessed through the SMTP protocol.
	 */
	export const MAILTO:SchemeValue.MailTo = "mailto";


	/**
	 * The resource is accessed through a named pipe.
	 */
	export const PIPE:SchemeValue.Pipe = "net.pipe";


	/**
	 * The resource is accessed from TCP endpoint.
	 */
	export const TCP:SchemeValue.TCP = "net.tcp";


	/**
	 * The resource is accessed through the NNTP protocol.
	 */
	export const NEWS:SchemeValue.NNTP = "news";


	/**
	 * The resource is accessed through the NNTP protocol.
	 */
	export const NNTP:SchemeValue.NNTP = "nntp";


	/**
	 * The resource is accessed through the TELNET protocol.
	 */
	export const TELNET:SchemeValue.Telnet = "telnet";

	/**
	 * The resource is accessed through a unique UUID endpoint name for communicating with a service.
	 */
	export const UUID:SchemeValue.UUID = "uuid";

	/**
	 * An index of possible values to validate against.
	 * @type {Array}
	 */
	export const All = Object.freeze([
		File, FTP, GOPHER, HTTP, HTTPS, LDAP, MAILTO, PIPE, TCP, NEWS, NNTP, TELNET, UUID
	]);

	export function isValid(scheme:string):scheme is SchemeValue.Any
	{
		return All.indexOf(<any>scheme)!= -1;
	}

}

Object.freeze(Scheme);

export default Scheme;