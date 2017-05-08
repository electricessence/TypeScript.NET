/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based on: https://msdn.microsoft.com/en-us/library/system.uri%28v=vs.110%29.aspx
 */

import {UriHostNameType} from "./HostNameType";
import {ISerializable} from "../Serialization/ISerializable";
import {IUri} from "./IUri";
import {IEquatable} from "../IEquatable";

/**
 * Provides an object representation of a uniform resource identifier (URI) and easy access to the parts of the URI.
 * Currently retained for reference to the .NET implementation.
 */
interface IUriDotNet extends IUri, ISerializable, IEquatable<IUri>
{

	/**
	 * Gets the absolute URI.
	 */
	absoluteUri:string;

	/**
	 * Gets the Domain Name System (DNS) host name or IP address and the port number for a server.
	 */
	authority:string;

	/**
	 * Gets an unescaped host name that is safe to use for DNS resolution.
	 */
	dnsSafeHost:string;


	/**
	 * Gets the type of the host name specified in the URI.
	 */
	hostNameType:UriHostNameType;


	/**
	 * The RFC 3490 compliant International Domain Name of the host, using Puny-code as appropriate.
	 */
	idnHost:string;

	/**
	 * Gets whether the Uri instance is absolute.
	 */
	isAbsoluteUri:boolean;

	/**
	 * Gets whether the port value of the URI is the default for this scheme.
	 */
	isDefaultPort:boolean;

	/**
	 * Gets a value indicating whether the specified Uri is a file URI.
	 */
	isFile:boolean;


	/**
	 * Gets whether the specified Uri references the local host.
	 */
	isLoopback:boolean;

	/**
	 * Gets whether the specified Uri is a universal naming convention (UNC) path.
	 */
	isUnc:boolean;

	/**
	 * Gets a local operating-system representation of a file name.
	 */
	localPath:string;


	/**
	 * Gets the original URI string that was passed to the Uri constructor.
	 */
	originalString:string;


	/**
	 * Gets the AbsolutePath and Query properties separated by a question mark (?).
	 */
	pathAndQuery:string;


	/**
	 * Gets an array containing the path segments that make up the specified URI.
	 */
	segments:string[];


	// UserEscaped = the user got away... LOL JK
	/**
	 * Indicates that the URI string was completely escaped before the Uri instance was created.
	 */
	userEscaped:boolean;


}

export default IUriDotNet;
