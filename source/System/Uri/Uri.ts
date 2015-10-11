/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based on: https://en.wikipedia.org/wiki/Uniform_Resource_Identifier
 */

///<reference path="IUri.d.ts"/>
import copy = require('../Utility/shallowCopy');
import Types = require('../Types');
import UriScheme = require('./Scheme');
import ArgumentException = require('../Exceptions/ArgumentException');
import ArgumentNullException = require('../Exceptions/ArgumentNullException');
import ArgumentOutOfRangeException = require('../Exceptions/ArgumentOutOfRangeException');
import QueryParams = require('./QueryParams');


/**
 * Provides an read-only model representation of a uniform resource identifier (URI) and easy access to the parts of the URI.
 *
 * The read-only model (frozen) is easier for debugging than exposing accessors for each property.
 */
class Uri implements IUri
{

	scheme:string;
	userInfo:string;
	host:string;
	port:number;
	path:string;
	query:string;
	fragment:string;

	queryParams:IMap<string|boolean|number>;

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
		query:string,
		fragment:string)
	{
		var _ = this;
		_.scheme = getScheme(scheme);
		_.userInfo = userInfo;
		_.host = host;
		_.port = port;
		_.path = path;
		_.query = formatQuery(query);
		_.fragment = formatFragment(fragment);

		// This should validate the uri...
		_.absoluteUri = _.getAbsoluteUri();
		_.authority = _.getAuthority();
		_.pathAndQuery = _.getPathAndQuery();

		Object.freeze(_.queryParams
			= query
			? QueryParams.parseToMap(query)
			: {});

		// Intended to be read-only.  Call .toMap() to get a writable copy.
		Object.freeze(_);
	}

	static from(uri:IUri):Uri
	{
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

	// TODO: Include a parse method.
	//static parse(url:string):Uri {
	//
	//}

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
	 * The segments that represent a path. https://msdn.microsoft.com/en-us/library/system.uri.segments%28v=vs.110%29.aspx
	 *
	 * Example:
	 * If the path value equals: ```/tree/node/index.html```
	 * The result will be: ```javascript ['/','tree/','node/','index.html'] ```
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
		var _ = this;
		var map:IUri = {};

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
		return uriToString(uri);
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

const SLASH = '/', QM = '?', HASH = '#';

function getScheme(scheme:UriScheme|string):string
{
	var s:any = scheme;
	if(Types.isString(s))
	{
		if(!s) return undefined;

		s = UriScheme[s.toLowerCase().replace(/^\s+|[^a-z.]+$/g, '')];

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

	var result = uri.host || '';

	if(result)
	{
		if(uri.userInfo) result = uri.userInfo + "@" + result;
		if(!isNaN(uri.port)) result += ':' + uri.port;
		result = '//' + result;
	}

	return result;
}

function formatQuery(query:string):string {
	return query && ((query.indexOf(QM)== -1 ? QM : '') + query);
}

function formatFragment(fragment:string):string {
	return fragment && ((fragment.indexOf(HASH)== -1 ? HASH : '') + fragment);
}

function getPathAndQuery(uri:IUri):string
{

	var path  = uri.path,
	    query = uri.query;

	return ''
		+ (path && ((path.indexOf(SLASH)== -1 ? SLASH : '') + path) || '')
		+ (formatQuery(query) || '');

}

function uriToString(uri:IUri):string
{
	// scheme:[//[user:password@]domain[:port]][/]path[?query][#fragment]
	// {scheme}{authority}{path}{query}{fragment}

	var scheme       = getScheme(uri.scheme),
	    authority    = getAuthority(uri),
	    pathAndQuery = getPathAndQuery(uri),
	    fragment     = formatFragment(uri.fragment);

	return ''
		+ ((scheme && (scheme + ':')) || '')
		+ (authority || '')
		+ (pathAndQuery || '')
		+ (fragment || '')

}


export = Uri;
