/// <reference path="../../../../../source/System/Collections/Array/IArray.d.ts" />
/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import IndexEnumerator from "./IndexEnumerator";
export default class ArrayEnumerator<T> extends IndexEnumerator<T> {
    constructor(arrayFactory: () => IArray<T>, start?: number, step?: number);
    constructor(array: IArray<T>, start?: number, step?: number);
}
