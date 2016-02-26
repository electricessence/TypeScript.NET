/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based on: https://msdn.microsoft.com/en-us/library/system.uri.scheme%28v=vs.110%29.aspx
 */

declare type FileScheme = 'file';
declare type GopherScheme = 'gopher';
declare type FtpScheme = 'ftp';
declare type HttpScheme = 'http';
declare type HttpsScheme = 'https';
declare type LdapScheme = 'ldap';
declare type MailtoScheme = 'mailto';
declare type PipeScheme = 'net.pipe';
declare type TcpScheme = 'net.tcp';
declare type NntpScheme = 'nntp';
declare type TelnetScheme = 'telnet';
declare type UuidScheme = 'uuid';

/**
 * The allowed HTTP Method values.
 */
declare type SchemeValue
	= FileScheme
	| GopherScheme
	| FtpScheme
	| HttpScheme
	| HttpsScheme
	| LdapScheme
	| MailtoScheme
	| PipeScheme
	| TcpScheme
	| NntpScheme
	| TelnetScheme
	| UuidScheme;
