/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based on: https://en.wikipedia.org/wiki/Uniform_Resource_Identifier
 */
import { IUri } from "./IUri";
import { IEquatable } from "../IEquatable";
export declare class Uri implements IUri, IEquatable<IUri> {
    readonly: string;
    SchemeValue: number;
    readonly: any;
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
