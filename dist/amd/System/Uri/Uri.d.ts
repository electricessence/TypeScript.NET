/// <reference path="../../../../source/System/Uri/IUri.d.ts" />
/// <reference path="../../../../source/System/IEquatable.d.ts" />
/// <reference path="../../../../source/System/Primitive.d.ts" />
/// <reference path="../../../../source/System/Uri/IUriComponentFormattable.d.ts" />
/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based on: https://en.wikipedia.org/wiki/Uniform_Resource_Identifier
 */
import UriScheme from "../Uri/Scheme";
export default class Uri implements IUri, IEquatable<IUri> {
    scheme: SchemeValue;
    userInfo: string;
    host: string;
    port: number;
    path: string;
    query: string;
    fragment: string;
    queryParams: IMap<Primitive | Primitive[]>;
    constructor(scheme: UriScheme | SchemeValue, userInfo: string, host: string, port: number, path: string, query?: QueryParamsConvertible, fragment?: string);
    equals(other: IUri): boolean;
    static from(uri: string | IUri, defaults?: IUri): Uri;
    static parse(url: string, throwIfInvalid?: boolean): IUri;
    static tryParse(url: string, out: (result: IUri) => void): boolean;
    static copyOf(map: IUri): IUri;
    copyTo(map: IUri): IUri;
    updateQuery(query: QueryParamsConvertible): Uri;
    protected getAbsoluteUri(): string;
    protected getAuthority(): string;
    protected getPathAndQuery(): string;
    absoluteUri: string;
    authority: string;
    pathAndQuery: string;
    baseUri: string;
    pathSegments: string[];
    toMap(): IUri;
    toString(): string;
    static toString(uri: IUri): string;
    static getAuthority(uri: IUri): string;
}
export declare enum Fields {
    scheme = 0,
    userInfo = 1,
    host = 2,
    port = 3,
    path = 4,
    query = 5,
    fragment = 6,
}
