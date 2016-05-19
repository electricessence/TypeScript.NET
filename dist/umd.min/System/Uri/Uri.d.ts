/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based on: https://en.wikipedia.org/wiki/Uniform_Resource_Identifier
 */
import * as QueryParam from "./QueryParam";
import { SchemeValue } from "./SchemeValue";
import { IUri } from "./IUri";
import { IMap } from "../Collections/Dictionaries/IDictionary";
import { Primitive } from "../Primitive";
import { IEquatable } from "../IEquatable";
export declare class Uri implements IUri, IEquatable<IUri> {
    scheme: SchemeValue;
    userInfo: string;
    host: string;
    port: number;
    path: string;
    query: string;
    fragment: string;
    queryParams: IMap<Primitive | Primitive[]>;
    constructor(scheme: SchemeValue, userInfo: string, host: string, port: number, path: string, query?: QueryParam.Convertible, fragment?: string);
    equals(other: IUri): boolean;
    static from(uri: string | IUri, defaults?: IUri): Uri;
    static parse(url: string, throwIfInvalid?: boolean): IUri;
    static tryParse(url: string, out: (result: IUri) => void): boolean;
    static copyOf(map: IUri): IUri;
    copyTo(map: IUri): IUri;
    updateQuery(query: QueryParam.Convertible): Uri;
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
export default Uri;
