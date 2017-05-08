/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { Primitive } from "../../Primitive";
import { Comparison, EqualityComparison } from "../../FunctionTypes";
import { IComparable } from "../../IComparable";
export declare function areAllEqual(arrays: ArrayLike<ArrayLike<any>>, equalityComparer?: EqualityComparison<any>): boolean;
export declare function areAllEqual(arrays: ArrayLike<ArrayLike<any>>, strict: boolean, equalityComparer?: EqualityComparison<any>): boolean;
/**
 * Compares two arrays for equality.
 * @param a
 * @param b
 * @param equalityComparer
 */
export declare function areEqual<T>(a: ArrayLike<T>, b: ArrayLike<T>, equalityComparer?: EqualityComparison<T>): boolean;
export declare function areEqual<T>(a: ArrayLike<T>, b: ArrayLike<T>, strict: boolean, equalityComparer?: EqualityComparison<T>): boolean;
export declare function areEquivalent<T extends Primitive>(a: ArrayLike<T>, b: ArrayLike<T>): boolean;
export declare function areEquivalent<T>(a: ArrayLike<IComparable<T>>, b: ArrayLike<IComparable<T>>): boolean;
export declare function areEquivalent<T>(a: ArrayLike<T>, b: ArrayLike<T>, comparer: Comparison<T>): boolean;
