/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { ReadOnlyCollectionBase } from "../ReadOnlyCollectionBase";
import { IArray } from "./IArray";
export default class ReadOnlyArrayWrapper<T> extends ReadOnlyCollectionBase<T> {
    constructor(array: IArray<T>);
    getValueAt: (index: number) => T;
}
