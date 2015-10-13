/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based on: https://en.wikipedia.org/wiki/Uniform_Resource_Identifier
 */

///<reference path="IUri.d.ts"/>
///<reference path="../IEquatable.d.ts"/>
import Types from '../Types';
import * as QueryParams from '../Uri/QueryParams';
import copy from '../Utility/shallowCopy';
import UriScheme from '../Uri/Scheme';
import ArgumentException from '../Exceptions/ArgumentException';
import ArgumentNullException from '../Exceptions/ArgumentNullException';
import ArgumentOutOfRangeException from '../Exceptions/ArgumentOutOfRangeException';


type Primitive = string|boolean|number;

/**
 * Provides an read-only model representation of a uniform resource identifier (URI) and easy access to the parts of the URI.
 *
 * The read-only model (frozen) is easier for debugging than exposing accessors for each property.
 */
export default
class Uri implements IUri, IEquatable<IUri>
{

	scheme:string;
	userInfo:string;
	host:string;
	port:number;
	path:string;
	query:string;
	fragment:string;

	queryParams:IMap<Primitive>;

	/**
	 * @param scheme The user name, password, or other user-specific information associated with the specified URI.
	 * @param userInfo The host component of this instance.
	 * @param host The port number of this URI.
	 * @param port The absolute path of the URI.
	 * @param path The absolute path of the URI.
	 * @param query Any query information included in the specified URI.
	 * @param fragment The escaped URI fragment.
	 */
	constructor(
		scheme:UriScheme|string,
		userInfo:string,
		host:string,
		port:number,
		path:string,
		query:string|IUriComponentMap|IKeyValuePair<string,Primitive>[],
		fragment:string)
	{
		var _ = this;
		_.scheme = getScheme(scheme) || null;
		_.userInfo = userInfo || null;
		_.host = host || null;
		_.port = port;
		_.path = path || null;


		if(!Types.isString(query))
			query = QueryParams.encode(<IUriComponentMap|IKeyValuePair<string,Primitive>[]>query);

		_.query = formatQuery(<string>query) || null;
		_.fragment = formatFragment(fragment) || null;

		// This should validate the uri...
		_.absoluteUri = _.getAbsoluteUri();
		_.authority = _.getAuthority() || null;
		_.pathAndQuery = _.getPathAndQuery() || null;

		Object.freeze(_.queryParams
			= _.query
			? QueryParams.parseToMap(_.query)
			: {});

		// Intended to be read-only.  Call .toMap() to get a writable copy.
		Object.freeze(_);
	}

	/**
	 *  Compares the values of another IUri via toString comparison.
 	 * @param other
	 * @returns {boolean}
	 */
	equals(other:IUri):boolean
	{
		return this.absoluteUri==Uri.toString(other);
	}


	/**
	 * Parses or clones values from existing Uri values.
	 * @param url
	 * @returns {Uri} An validated Uri object with the values.
	 */
	static from(url:string|IUri):Uri
	{
		var uri = (!url || Types.isString(url))
			? parse(<string>url) : <IUri>url;

		return new Uri(
			uri.scheme,
			uri.userInfo,
			uri.host,
			uri.port,
			uri.path,
			uri.query,
			uri.fragment
		);
	}

	/**
	 * Parse a URL into it's components.
	 * @param url
	 * @returns {IUri} Returns a map of the values.
	 */
	static parse(url:string):IUri
	{
		return parse(url);
	}

	copyTo(map:IUri):IUri
	{
		var _ = this;

		if(_.scheme) map.scheme = _.scheme;
		if(_.userInfo) map.userInfo = _.userInfo;
		if(_.host) map.host = _.host;
		if(_.port) map.port = _.port;
		if(_.path) map.path = _.path;
		if(_.query) map.query = _.query;
		if(_.fragment) map.fragment = _.fragment;

		return map;
	}

	/**
	 * Is provided for sub classes to override this value.
	 */
	protected getAbsoluteUri():string
	{
		return uriToString(this);
	}

	/**
	 * Is provided for sub classes to override this value.
	 */
	protected getAuthority():string
	{
		return getAuthority(this);
	}

	/**
	 * Is provided for sub classes to override this value.
	 */
	protected getPathAndQuery():string
	{
		return getPathAndQuery(this);
	}

	/**
	 * The absolute URI.
	 */
	absoluteUri:string;

	/**
	 * Gets the Domain Name System (DNS) host name or IP address and the port number for a server.
	 */
	authority:string;

	/**
	 * Gets the path and Query properties separated by a question mark (?).
	 */
	pathAndQuery:string;

	/**
	 * The segments that represent a path.<br/>
	 * https://msdn.microsoft.com/en-us/library/system.uri.segments%28v=vs.110%29.aspx
	 *
	 * <h5><b>Example:</b></h5>
	 * If the path value equals: ```/tree/node/index.html```<br/>
	 * The result will be: ```['/','tree/','node/','index.html']```
	 * @returns {string[]}
	 */
	get pathSegments():string[]
	{
		return this.path.match(/^[/]|[^/]*[/]|[^/]+$/g);
	}

	/**
	 * Creates a writable copy.
	 * @returns {IUri}
	 */
	toMap():IUri
	{
		return this.copyTo({});
	}

	/**
	 * @returns {string} The full absolute uri.
	 */
	toString():string
	{
		return this.absoluteUri;
	}

	/**
	 * Properly converts an existing URI to a string.
	 * @param uri
	 * @returns {string}
	 */
	static toString(uri:IUri):string
	{
		return uri instanceof Uri
			? (<Uri>uri).absoluteUri
			: uriToString(uri);
	}

	/**
	 * Returns the authority segment of an URI.
	 * @param uri
	 * @returns {string}
	 */
	static getAuthority(uri:IUri):string
	{
		return getAuthority(uri);
	}


}

const SLASH = '/', SLASH2 = '//', QM = '?', HASH = '#', EMPTY = '', AT = '@';

function trim(source:string):string
{
	return source.replace(/^\s+|\s+$/g, EMPTY);
}

function getScheme(scheme:UriScheme|string):string
{
	var s:any = scheme;
	if(Types.isString(s))
	{
		if(!s) return undefined;

		s = UriScheme[<any>trim(s).toLowerCase().replace(/[^a-z0-9+.-]+$/g, EMPTY)];

		if(isNaN(s))
			throw new ArgumentOutOfRangeException('scheme', scheme, 'Invalid scheme.');
	}

	if(Types.isNumber(s, false))
	{
		s = UriScheme[<number>s];
		if(!s)
			throw new ArgumentOutOfRangeException('scheme', scheme, 'Invalid scheme.');

		return s;
	}

	return undefined;
}

function getAuthority(uri:IUri):string
{

	if(!uri.host)
	{
		if(uri.userInfo)
			throw new ArgumentException('host', 'Cannot include user info when there is no host.');

		if(!isNaN(uri.port))
			throw new ArgumentException('host', 'Cannot include a port when there is no host.');
	}

	/*
	 * [//[user:password@]host[:port]]
	 */

	var result = uri.host || EMPTY;

	if(result)
	{
		if(uri.userInfo) result = uri.userInfo + AT + result;
		if(!isNaN(uri.port)) result += ':' + uri.port;
		result = SLASH2 + result;
	}

	return result;
}

function formatQuery(query:string):string
{
	return query && ((query.indexOf(QM)== -1 ? QM : EMPTY) + query);
}

function formatFragment(fragment:string):string
{
	return fragment && ((fragment.indexOf(HASH)== -1 ? HASH : EMPTY) + fragment);
}

function getPathAndQuery(uri:IUri):string
{

	var path  = uri.path,
	    query = uri.query;

	return EMPTY
		+ (path && ((path.indexOf(SLASH)== -1 ? SLASH : EMPTY) + path) || EMPTY)
		+ (formatQuery(query) || EMPTY);

}

function uriToString(uri:IUri):string
{
	// scheme:[//[user:password@]domain[:port]][/]path[?query][#fragment]
	// {scheme}{authority}{path}{query}{fragment}

	var scheme       = getScheme(uri.scheme),
	    authority    = getAuthority(uri),
	    pathAndQuery = getPathAndQuery(uri),
	    fragment     = formatFragment(uri.fragment);

	return EMPTY
		+ ((scheme && (scheme + ':')) || EMPTY)
		+ (authority || EMPTY)
		+ (pathAndQuery || EMPTY)
		+ (fragment || EMPTY)

}


function parse(
	url:string):IUri
{
	if(!url)
		throw new ArgumentException('url', 'Nothing to parse.');


	// Could use a regex here, but well follow some rules instead.
	// The intention is to 'gather' the pieces.  This isn't validation (yet).

	// scheme:[//[user:password@]domain[:port]][/]path[?query][#fragment]
	var i:number, result:IUri = {};

	// Anything after the first # is the fragment.
	i = url.indexOf(HASH);
	if(i!= -1)
	{
		result.fragment = url.substring(i);
		url = url.substring(0, i);
	}

	// Anything after the first ? is the query.
	i = url.indexOf(QM);
	if(i!= -1)
	{
		result.query = url.substring(i);
		url = url.substring(0, i);
	}

	// Guarantees a separation.
	i = url.indexOf(SLASH2);
	if(i!= -1)
	{
		var scheme = trim(url.substring(0, i)), c = /:$/;
		if(!c.test(scheme))
			throw new ArgumentException('url','Scheme was improperly formatted');

		scheme = trim(scheme.replace(c,EMPTY));
		result.scheme = scheme || undefined;

		url = url.substring(i + 2);
	}

	// Find any path information.
	i = url.indexOf(SLASH);
	if(i!= -1)
	{
		result.path = url.substring(i) || undefined;
		url = url.substring(0, i);
	}

	// Separate user info.
	i = url.indexOf(AT);
	if(i!= -1)
	{
		result.userInfo = url.substring(0, i) || undefined;
		url = url.substring(i + 1);
	}

	// Remaining is host and port.
	i = url.indexOf(':');
	if(i!= -1)
	{
		var port = parseInt(trim(url.substring(i + 1)));
		if(isNaN(port))
			throw new ArgumentException('url','Port was invalid.');

		result.port = port;
		url = url.substring(0, i);
	}

	result.host = trim(url) || undefined;

	return result;

}
