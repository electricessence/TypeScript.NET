/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based on: https://en.wikipedia.org/wiki/Uniform_Resource_Identifier
 */
import {Type} from "../Types";
import {UriComponent} from "./UriComponent";
import {Scheme} from "./Scheme";
import {SchemeValue} from "./SchemeValue";
import {QueryParam} from "./QueryParam";
import {parseToMap, encode, Separator} from "./QueryParams";
import {trim} from "../Text/Utility";
import {Exception} from "../Exception";
import {ArgumentException} from "../Exceptions/ArgumentException";
import {ArgumentOutOfRangeException} from "../Exceptions/ArgumentOutOfRangeException";
import {IUri} from "./IUri";
import {IMap} from "../../IMap";
import {Primitive} from "../Primitive";
import {StringKeyValuePair} from "../KeyValuePair";
import {IEquatable} from "../IEquatable";
import {Action} from "../FunctionTypes";

const VOID0:undefined = void 0;

/**
 * Provides an read-only model representation of a uniform resource identifier (URI) and easy access to the parts of the URI.
 *
 * The read-only model (frozen) is easier for debugging than exposing accessors for each property.
 * ICloneable&lt;Uri&gt; is not used to prevent unnecessary copying of values that won't change.
 */
export class Uri implements IUri, IEquatable<IUri>
{

	readonly scheme:SchemeValue.Any | null;
	readonly userInfo:string | null;
	readonly host:string | null;
	readonly port:number | null;
	readonly path:string | null;
	readonly query:string | null;
	readonly fragment:string | null;

	readonly queryParams:IMap<Primitive|Primitive[]>;//Readonly<IMap<Primitive|Primitive[]>>;

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
		scheme:SchemeValue.Any|null,
		userInfo:string|null,
		host:string|null,
		port:number|null,
		path:string|null,
		query?:QueryParam.Convertible,
		fragment?:string)
	{
		const _ = this;
		this.scheme = getScheme(scheme) || null;
		this.userInfo = userInfo || null;
		this.host = host || null;

		this.port = getPort(port);

		this.authority = _.getAuthority() || null;

		this.path = path || null;


		if(!Type.isString(query))
			query = encode(<UriComponent.Map|StringKeyValuePair<Primitive>[]>query);

		this.query = formatQuery(<string>query) || null;
		Object.freeze(this.queryParams
			= _.query
			? parseToMap(_.query)
			: {});

		this.pathAndQuery = _.getPathAndQuery() || null;

		this.fragment = formatFragment(fragment) || null;

		// This should validate the uri...
		this.absoluteUri = _.getAbsoluteUri();

		this.baseUri = _.absoluteUri.replace(/[?#].*/, '');

		// Intended to be read-only.  Call .toMap() to get a writable copy.
		Object.freeze(this);
	}

	/**
	 *  Compares the values of another IUri via toString comparison.
	 * @param other
	 * @returns {boolean}
	 */
	equals(other:IUri):boolean
	{
		return this===other || this.absoluteUri==Uri.toString(other);
	}


	/**
	 * Parses or clones values from existing Uri values.
	 * @param uri
	 * @param defaults
	 * @returns {Uri}
	 */
	static from(uri:string|IUri|null|undefined, defaults?:IUri):Uri
	{
		const u = Type.isString(uri)
			? Uri.parse(<string>uri) // Parsing a string should throw errors.  Null or undefined simply means empty.
			: <IUri>uri;

		return new Uri(
			u && u.scheme || defaults && <any>defaults.scheme,
			u && u.userInfo || defaults && <any>defaults.userInfo,
			u && u.host || defaults && <any>defaults.host,
			u && Type.isNumber(u.port) ? u.port : defaults && <any>defaults.port,
			u && u.path || defaults && <any>defaults.path,
			u && u.query || defaults && <any>defaults.query,
			u && u.fragment || defaults && <any>defaults.fragment
		);
	}


	/**
	 * Parses a URL into it's components.
	 * @param url The url to parse.
	 * @returns {IUri} Will throw an exception if not able to parse.
	 */
	static parse(url:string):IUri

	static parse(url:string, throwIfInvalid:true):IUri

	/**
	 * Parses a URL into it's components.
	 * @param url The url to parse.
	 * @param throwIfInvalid Defaults to true.
	 * @returns {IUri} Returns a map of the values or *null* if invalid and *throwIfInvalid* is <b>false</b>.
	 */
	static parse(url:string, throwIfInvalid:boolean):IUri|null
	static parse(url:string, throwIfInvalid:boolean = true):IUri|null
	{
		let result:IUri|null = null;
		const ex = tryParse(url, (out) => {result = out;});
		if(throwIfInvalid && ex) throw ex;
		return result;
	}

	/**
	 * Parses a URL into it's components.
	 * @param url The url to parse.
	 * @param out A delegate to capture the value.
	 * @returns {boolean} True if valid.  False if invalid.
	 */
	static tryParse(url:string, out:(result:IUri)=>void):boolean
	{
		return !tryParse(url, out); // return type is Exception.
	}

	static copyOf(map:IUri):IUri
	{
		return copyUri(map);
	}

	copyTo(map:IUri):IUri
	{
		return copyUri(this, map);
	}

	updateQuery(query:QueryParam.Convertible):Uri
	{
		const map = this.toMap();
		map.query = <any>query;
		return Uri.from(map);
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
	readonly authority:string | null;

	/**
	 * Gets the path and Query properties separated by a question mark (?).
	 */
	readonly pathAndQuery:string | null;

	/**
	 * Gets the full path without the query or fragment.
	 */
	readonly baseUri:string;

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
		return this.path
			&& this.path.match(/^[/]|[^/]*[/]|[^/]+$/g)
			|| [];
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
		return uri instanceof <any>Uri
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

export enum Fields {
	scheme,
	userInfo,
	host,
	port,
	path,
	query,
	fragment
}
Object.freeze(Fields);

function copyUri(from:IUri, to?:IUri)
{
	let i = 0, field:string;
	if(!to) to = {};
	while(field = Fields[i++])
	{
		const value = (<any>from)[field];
		if(value) (<any>to)[field] = value;
	}
	return to;
}

const SLASH = '/', SLASH2 = '//', QM = Separator.Query, HASH = '#', EMPTY = '', AT = '@';

function getScheme(scheme:SchemeValue.Any|string|null|undefined):SchemeValue.Any|null
{
	let s:any = scheme;
	if(Type.isString(s))
	{
		if(!s) return null;
		s = trim(s)
			.toLowerCase()
			.replace(/[^a-z0-9+.-]+$/g, EMPTY);
		if(!s) return null;
		if(Scheme.isValid(s)) return s;
	}
	else
	{
		if(s===null || s===undefined) return s;
	}
	throw new ArgumentOutOfRangeException('scheme', scheme, 'Invalid scheme.');
}

function getPort(port:number|string|null|undefined):number|null
{
	if(port===0) return <number>port;
	if(!port) return null;
	let p:number;

	if(Type.isNumber(port, true))
	{
		p = <number>port;
		if(p>=0 && isFinite(p))
			return p;
	}
	else if(Type.isString(port) && (p = parseInt(<string>port)) && !isNaN(p))
	{
		return getPort(p);
	}

	throw new ArgumentException("port", "invalid value");
}

function getAuthority(uri:IUri):string
{

	if(!uri.host)
	{
		if(uri.userInfo)
			throw new ArgumentException('host', 'Cannot include user info when there is no host.');

		if(Type.isNumber(uri.port, false))
			throw new ArgumentException('host', 'Cannot include a port when there is no host.');
	}

	/*
	 * [//[user:password@]host[:port]]
	 */

	let result = uri.host || EMPTY;

	if(result)
	{
		if(uri.userInfo) result = uri.userInfo + AT + result;
		if(!isNaN(<any>(uri.port))) result += ':' + uri.port;
		result = SLASH2 + result;
	}

	return result;
}

function formatQuery(query:string|null|undefined):string|null|undefined
{
	return query && ((query.indexOf(QM)!==0 ? QM : EMPTY) + query);
}

function formatFragment(fragment:string|null|undefined):string|null|undefined
{
	return fragment && ((fragment.indexOf(HASH)!==0 ? HASH : EMPTY) + fragment);
}

function getPathAndQuery(uri:IUri):string
{

	const path  = uri.path,
	      query = uri.query;

	return EMPTY
		+ (path || EMPTY)
		+ (formatQuery(query) || EMPTY);

}

function uriToString(uri:IUri):string
{
	// scheme:[//[user:password@]domain[:port]][/]path[?query][#fragment]
	// {scheme}{authority}{path}{query}{fragment}

	const scheme = getScheme(uri.scheme);
	let authority = getAuthority(uri);
	const pathAndQuery = getPathAndQuery(uri),
	      fragment     = formatFragment(uri.fragment);

	const part1 = EMPTY
		+ ((scheme && (scheme + ':')) || EMPTY)
		+ (authority || EMPTY);

	let part2 = EMPTY
		+ (pathAndQuery || EMPTY)
		+ (fragment || EMPTY);

	if(part1 && part2 && scheme && !authority)
		throw new ArgumentException('authority', "Cannot format schemed Uri with missing authority.");

	if(part1 && pathAndQuery && pathAndQuery.indexOf(SLASH)!==0)
		part2 = SLASH + part2;

	return part1 + part2;

}


function tryParse(url:string, out:Action<IUri>):null|Exception
{
	if(!url)
		return new ArgumentException('url', 'Nothing to parse.');


	// Could use a regex here, but well follow some rules instead.
	// The intention is to 'gather' the pieces.  This isn't validation (yet).

	// scheme:[//[user:password@]domain[:port]][/]path[?query][#fragment]
	let i:number;
	const result:IUri = {};

	// Anything after the first # is the fragment.
	i = url.indexOf(HASH);
	if(i!= -1)
	{
		result.fragment = url.substring(i + 1) || VOID0;
		url = url.substring(0, i);
	}

	// Anything after the first ? is the query.
	i = url.indexOf(QM);
	if(i!= -1)
	{
		result.query = url.substring(i + 1) || VOID0;
		url = url.substring(0, i);
	}

	// Guarantees a separation.
	i = url.indexOf(SLASH2);
	if(i!= -1)
	{
		let scheme = trim(url.substring(0, i));
		const c = /:$/;
		if(!c.test(scheme))
			return new ArgumentException('url', 'Scheme was improperly formatted');

		scheme = trim(scheme.replace(c, EMPTY));
		try
		{
			result.scheme = getScheme(scheme) || VOID0;
		}
		catch(ex)
		{
			return ex;
		}

		url = url.substring(i + 2);
	}

	// Find any path information.
	i = url.indexOf(SLASH);
	if(i!= -1)
	{
		result.path = url.substring(i);
		url = url.substring(0, i);
	}

	// Separate user info.
	i = url.indexOf(AT);
	if(i!= -1)
	{
		result.userInfo = url.substring(0, i) || VOID0;
		url = url.substring(i + 1);
	}

	// Remaining is host and port.
	i = url.indexOf(':');
	if(i!= -1)
	{
		const port = parseInt(trim(url.substring(i + 1)));
		if(isNaN(port))
			return new ArgumentException('url', 'Port was invalid.');

		result.port = port;
		url = url.substring(0, i);
	}

	url = trim(url);
	if(url)
		result.host = url;

	out(copyUri(result));

	// null is good! (here)
	return null;

}

export default Uri;