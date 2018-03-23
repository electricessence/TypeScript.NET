/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
import Primitive from "../../Primitive";
import IComparable from "../../IComparable";
import { Comparison } from "../../FunctionTypes";
/**
 * Returns true if both arrays contain the same set of values.
 * @param {ArrayLike} a
 * @param {ArrayLike} b
 * @returns {boolean}
 */
export default function areArraysEquivalent<T extends Primitive>(a: ArrayLike<T>, b: ArrayLike<T>): boolean;
export default function areArraysEquivalent<T>(a: ArrayLike<IComparable<T>>, b: ArrayLike<IComparable<T>>): boolean;
export default function areArraysEquivalent<T>(a: ArrayLike<T>, b: ArrayLike<T>, comparer: Comparison<T>): boolean;
