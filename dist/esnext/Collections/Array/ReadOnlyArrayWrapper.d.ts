/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import ReadOnlyCollectionWrapper from "../ReadOnlyCollectionWrapper";
export default class ReadOnlyArrayWrapper<T> extends ReadOnlyCollectionWrapper<T> {
    constructor(array: ArrayLike<T>);
    protected _onDispose(): void;
    private __getValueAt;
    getValueAt(index: number): T;
}
