/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based on: https://en.wikipedia.org/wiki/Uniform_Resource_Identifier
 */
import { SchemeValue } from "./SchemeValue";
import { QueryParam } from "./QueryParam";
import { IUri } from "./IUri";
import { IMap } from "../../IMap";
import { Primitive } from "../Primitive";
import { IEquatable } from "../IEquatable";
/**
 * Provides an read-only model representation of a uniform resource identifier (URI) and easy access to the parts of the URI.
 *
 * The read-only model (frozen) is easier for debugging than exposing accessors for each property.
 * ICloneable&lt;Uri&gt; is not used to prevent unnecessary copying of values that won't change.
 */
export declare class Uri implements IUri, IEquatable<IUri> {
    readonly scheme: SchemeValue.Any | null;
    readonly userInfo: string | null;
    readonly host: string | null;
    readonly port: number | null;
    readonly path: string | null;
    readonly query: string | null;
    readonly fragment: string | null;
    readonly queryParams: IMap<Primitive | Primitive[]>;
    /**
     * @param scheme The user name, password, or other user-specific information associated with the specified URI.
     * @param userInfo The host component of this instance.
     * @param host The port number of this URI.
     * @param port The absolute path of the URI.
     * @param path The absolute path of the URI.
     * @param query Any query information included in the specified URI.
     * @param fragment The escaped URI fragment.
     */
    constructor(scheme: SchemeValue.Any | null, userInfo: string | null, host: string | null, port: number | null, path: string | null, query?: QueryParam.Convertible, fragment?: string);
    /**
     *  Compares the values of another IUri via toString comparison.
     * @param other
     * @returns {boolean}
     */
    equals(other: IUri): boolean;
    /**
     * Parses or clones values from existing Uri values.
     * @param uri
     * @param defaults
     * @returns {Uri}
     */
    static from(uri: string | IUri | null | undefined, defaults?: IUri): Uri;
    /**
     * Parses a URL into it's components.
     * @param url The url to parse.
     * @returns {IUri} Will throw an exception if not able to parse.
     */
    static parse(url: string): IUri;
    static parse(url: string, throwIfInvalid: true): IUri;
    /**
     * Parses a URL into it's components.
     * @param url The url to parse.
     * @param throwIfInvalid Defaults to true.
     * @returns {IUri} Returns a map of the values or *null* if invalid and *throwIfInvalid* is <b>false</b>.
     */
    static parse(url: string, throwIfInvalid: boolean): IUri | null;
    /**
     * Parses a URL into it's components.
     * @param url The url to parse.
     * @param out A delegate to capture the value.
     * @returns {boolean} True if valid.  False if invalid.
     */
    static tryParse(url: string, out: (result: IUri) => void): boolean;
    static copyOf(map: IUri): IUri;
    copyTo(map: IUri): IUri;
    updateQuery(query: QueryParam.Convertible): Uri;
    /**
     * Is provided for sub classes to override this value.
     */
    protected getAbsoluteUri(): string;
    /**
     * Is provided for sub classes to override this value.
     */
    protected getAuthority(): string;
    /**
     * Is provided for sub classes to override this value.
     */
    protected getPathAndQuery(): string;
    /**
     * The absolute URI.
     */
    absoluteUri: string;
    /**
     * Gets the Domain Name System (DNS) host name or IP address and the port number for a server.
     */
    readonly authority: string | null;
    /**
     * Gets the path and Query properties separated by a question mark (?).
     */
    readonly pathAndQuery: string | null;
    /**
     * Gets the full path without the query or fragment.
     */
    readonly baseUri: string;
    /**
     * The segments that represent a path.<br/>
     * https://msdn.microsoft.com/en-us/library/system.uri.segments%28v=vs.110%29.aspx
     *
     * <h5><b>Example:</b></h5>
     * If the path value equals: ```/tree/node/index.html```<br/>
     * The result will be: ```['/','tree/','node/','index.html']```
     * @returns {string[]}
     */
    readonly pathSegments: string[];
    /**
     * Creates a writable copy.
     * @returns {IUri}
     */
    toMap(): IUri;
    /**
     * @returns {string} The full absolute uri.
     */
    toString(): string;
    /**
     * Properly converts an existing URI to a string.
     * @param uri
     * @returns {string}
     */
    static toString(uri: IUri): string;
    /**
     * Returns the authority segment of an URI.
     * @param uri
     * @returns {string}
     */
    static getAuthority(uri: IUri): string;
}
export declare enum Fields {
    scheme = 0,
    userInfo = 1,
    host = 2,
    port = 3,
    path = 4,
    query = 5,
    fragment = 6
}
export default Uri;
