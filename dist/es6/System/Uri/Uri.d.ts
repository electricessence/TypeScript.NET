import * as QueryParam from "./QueryParam";
import { SchemeValue } from "./SchemeValue";
import { IUri } from "./IUri";
import { IMap } from "../Collections/Dictionaries/IDictionary";
import { Primitive } from "../Primitive";
import { IEquatable } from "../IEquatable";
export declare class Uri implements IUri, IEquatable<IUri> {
    readonly scheme: SchemeValue | null;
    readonly userInfo: string | null;
    readonly host: string | null;
    readonly port: number | null;
    readonly path: string | null;
    readonly query: string | null;
    readonly fragment: string | null;
    readonly queryParams: IMap<Primitive | Primitive[]>;
    constructor(scheme: SchemeValue | null, userInfo: string | null, host: string | null, port: number | null, path: string | null, query?: QueryParam.Convertible, fragment?: string);
    equals(other: IUri): boolean;
    static from(uri: string | IUri | null | undefined, defaults?: IUri): Uri;
    static parse(url: string): IUri;
    static parse(url: string, throwIfInvalid: boolean): IUri | null;
    static tryParse(url: string, out: (result: IUri) => void): boolean;
    static copyOf(map: IUri): IUri;
    copyTo(map: IUri): IUri;
    updateQuery(query: QueryParam.Convertible): Uri;
    protected getAbsoluteUri(): string;
    protected getAuthority(): string;
    protected getPathAndQuery(): string;
    absoluteUri: string;
    readonly authority: string | null;
    readonly pathAndQuery: string | null;
    readonly baseUri: string;
    readonly pathSegments: string[];
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
