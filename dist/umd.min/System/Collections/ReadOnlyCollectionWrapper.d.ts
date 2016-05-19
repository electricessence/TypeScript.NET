/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { ReadOnlyCollectionBase } from "./ReadOnlyCollectionBase";
import { ICollection } from "./ICollection";
export default class ReadOnlyCollectionWrapper<T> extends ReadOnlyCollectionBase<T> {
    constructor(c: ICollection<T>);
}
