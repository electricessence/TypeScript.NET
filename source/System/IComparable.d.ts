/*!
 * @author electricessence / https://github.com/electricessence/
 * Based upon .NET source.
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

///<reference path="Primitive.d.ts"/>

interface IComparable<T>
{
	compareTo(other:T): number;
}

declare type Comparable = Primitive|IComparable<any>;
