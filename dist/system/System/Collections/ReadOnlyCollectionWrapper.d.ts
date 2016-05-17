/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import ReadOnlyCollection from "./ReadOnlyCollectionBase";
export default class ReadOnlyCollectionWrapper<T> extends ReadOnlyCollection<T> {
    constructor(c: ICollection<T>);
}
