/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based on: https://msdn.microsoft.com/en-us/library/system.uri.scheme%28v=vs.110%29.aspx
 */
enum Scheme
{
	File   = 'file',
	Gopher = 'gopher',
	FTP    = 'ftp',
	HTTP   = 'http',
	HTTPS  = 'https',
	LDAP   = 'ldap',
	MailTo = 'mailto',
	Pipe   = 'net.pipe',
	TCP    = 'net.tcp',
	NNTP   = 'nntp',
	News   = 'news',
	Telnet = 'telnet',
	UUID   = 'uuid',
}

export function isValidScheme(scheme:string):scheme is Scheme
{
	if(!scheme) return false;
	scheme = scheme.toLowerCase();
	const s:any = Scheme;
	for(let key of Object.keys(s))
		if(s[key]==scheme) return true;
	return false;
}

export default Scheme;