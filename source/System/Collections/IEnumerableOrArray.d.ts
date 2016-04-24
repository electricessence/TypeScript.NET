/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

///<reference path="Enumeration/IEnumerable.d.ts"/>
///<reference path="Array/IArray.d.ts"/>

// Place IArray<T> in front for efficiency.
declare type IEnumerableOrArray<T> =  IArray<T> | IEnumerable<T>;