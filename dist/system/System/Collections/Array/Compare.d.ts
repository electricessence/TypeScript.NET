/// <reference path="../../../../../source/System/Collections/Array/IArray.d.ts" />
/// <reference path="../../../../../source/System/FunctionTypes.d.ts" />
/// <reference path="../../../../../source/System/Primitive.d.ts" />
/// <reference path="../../../../../source/System/IComparable.d.ts" />
/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
export declare function areAllEqual(arrays: any[][], strict?: boolean, equalityComparer?: EqualityComparison<any>): boolean;
export declare function areEqual<T>(a: IArray<T>, b: IArray<T>, strict?: boolean, equalityComparer?: EqualityComparison<T>): boolean;
export declare function areEquivalent<T extends Primitive>(a: IArray<T>, b: IArray<T>): boolean;
export declare function areEquivalent<T>(a: IArray<IComparable<T>>, b: IArray<IComparable<T>>): boolean;
export declare function areEquivalent<T>(a: IArray<T>, b: IArray<T>, comparer: Comparison<T>): boolean;
