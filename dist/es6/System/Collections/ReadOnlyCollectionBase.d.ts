/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { CollectionBase } from "./CollectionBase";
import { IEnumerator } from "./Enumeration/IEnumerator";
export declare abstract class ReadOnlyCollectionBase<T> extends CollectionBase<T> {
    protected abstract _getCount(): number;
    protected getCount(): number;
    protected getIsReadOnly(): boolean;
    protected _addInternal(entry: T): boolean;
    protected _removeInternal(entry: T, max?: number): number;
    protected _clearInternal(): number;
    protected abstract _getEnumerator(): IEnumerator<T>;
    getEnumerator(): IEnumerator<T>;
}
export default ReadOnlyCollectionBase;
