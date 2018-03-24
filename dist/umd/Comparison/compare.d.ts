/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import Primitive from "../Primitive";
import IComparable from "./IComparable";
import CompareResult from "./CompareResult";
/**
 * Compares two comparable objects or primitives.
 * @param a
 * @param b
 */
export default function compare<T>(a: IComparable<T>, b: IComparable<T>): number;
export default function compare<T extends Primitive>(a: T, b: T, strict?: boolean): CompareResult;
