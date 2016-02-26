/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based on: https://msdn.microsoft.com/en-us/library/system.uri.scheme%28v=vs.110%29.aspx
 */

// TODO: Possibly use string literals instead.
enum Scheme {
	/**
	 * The resource is a file on the local computer.
	 */
	file,


	/**
	 * The resource is accessed through FTP.
	 */
	ftp,


	/**
	 * The resource is accessed through the Gopher protocol.
	 */
	gopher,


	/**
	 * The resource is accessed through HTTP.
	 */
	http,


	/**
	 * The resource is accessed through SSL-encrypted HTTP.
	 */
	https,


	/**
	 * The resource is accessed through the LDAP protocol.
	 */
	ldap,


	/**
	 * The resource is an e-mail address and accessed through the SMTP protocol.
	 */
	mailto,


	/**
	 * The resource is accessed through a named pipe.
	 */
	pipe,


	/**
	 * The resource is accessed from TCP endpoint.
	 */
	tcp,


	/**
	 * The resource is accessed through the NNTP protocol.
	 */
	news,


	/**
	 * The resource is accessed through the NNTP protocol.
	 */
	nntp,


	/**
	 * The resource is accessed through the TELNET protocol.
	 */
	telnet,

	/**
	 * The resource is accessed through a unique UUID endpoint name for communicating with a service.
	 */
	uuid
}

// Extend the usefulness of the enum.
const PIPE = 'net.pipe';
const TCP = 'net.tcp';

Scheme[Scheme.pipe] = PIPE;
Scheme[Scheme.tcp] = TCP;

(<any>Scheme)[PIPE] = Scheme.pipe;
(<any>Scheme)[TCP] = Scheme.tcp;

Object.freeze(Scheme);

export default Scheme;
