/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { EqualityComparison, Predicate, Action } from "../../FunctionTypes";
import { IArray } from "./IArray";
export declare function initialize<T>(length: number): T[];
export declare function copy<T>(source: IArray<T>, sourceIndex?: number, length?: number): T[];
export declare function copyTo<T, TDestination extends IArray<any>>(source: IArray<T>, destination: TDestination, sourceIndex?: number, destinationIndex?: number, length?: number): TDestination;
export declare function indexOf<T>(array: IArray<T>, item: T, equalityComparer?: EqualityComparison<T>): number;
export declare function contains<T>(array: IArray<T>, item: T, equalityComparer?: EqualityComparison<T>): boolean;
export declare function replace<T>(array: IArray<T>, old: T, newValue: T, max?: number): number;
export declare function updateRange<T>(array: IArray<T>, value: T, start?: number, stop?: number): void;
export declare function clear(array: IArray<any>, start?: number, stop?: number): void;
export declare function register<T>(array: IArray<T>, item: T, equalityComparer?: EqualityComparison<T>): boolean;
export declare function findIndex<T>(array: IArray<T>, predicate: Predicate<T>): number;
export declare function forEach<T>(source: IArray<T>, action: Predicate<T> | Action<T>): void;
export declare function applyTo<T>(target: IArray<T>, fn: (a: T) => T): void;
export declare function removeIndex<T>(array: T[], index: number): boolean;
export declare function remove<T>(array: T[], value: T, max?: number, equalityComparer?: EqualityComparison<T>): number;
export declare function repeat<T>(element: T, count: number): T[];
export declare function range(first: number, count: number, step?: number): number[];
export declare function rangeUntil(first: number, until: number, step?: number): number[];
export declare function distinct(source: string[]): string[];
export declare function distinct(source: number[]): number[];
export declare function flatten(a: any[], recurseDepth?: number): any[];
