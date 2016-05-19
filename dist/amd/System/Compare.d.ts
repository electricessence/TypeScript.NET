/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { Primitive } from "./Primitive";
import { IComparable } from "./IComparable";
import { CompareResult } from "./CompareResult";
export declare function areEqual(a: any, b: any, strict?: boolean): boolean;
export declare function compare<T>(a: IComparable<T>, b: IComparable<T>): number;
export declare function compare<T extends Primitive>(a: T, b: T, strict?: boolean): CompareResult;
export declare function areEquivalent(a: any, b: any, nullEquivalency?: boolean, extraDepth?: number): boolean;
