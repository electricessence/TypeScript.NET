/*!
 * @author electricessence / https://github.com/electricessence/
 * Based upon .NET source.
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */


import {Primitive} from "./Primitive";

export interface IComparable<T>
{
	compareTo(other:T):number;
}

export declare type Comparable = Primitive|IComparable<any>;

export default IComparable;