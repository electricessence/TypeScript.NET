/*!
 * @author electricessence / https://github.com/electricessence/
 * Based Upon: http://msdn.microsoft.com/en-us/library/he2s3bh7%28v=vs.110%29.aspx
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { CollectionBase } from "./CollectionBase";
import { IEnumerator } from "./Enumeration/IEnumerator";
import { Predicate, Action, EqualityComparison } from "../FunctionTypes";
import { ILinkedList } from "./ILinkedList";
import { IEnumerableOrArray } from "./IEnumerableOrArray";
export declare class LinkedList<T> extends CollectionBase<T> implements ILinkedList<T> {
    private _listInternal;
    constructor(source?: IEnumerableOrArray<T>, equalityComparer?: EqualityComparison<T>);
    protected _onDispose(): void;
    protected getCount(): number;
    protected _addInternal(entry: T): boolean;
    protected _removeInternal(entry: T, max?: number): number;
    protected _clearInternal(): number;
    forEach(action: Predicate<T> | Action<T>, useCopy?: boolean): number;
    getEnumerator(): IEnumerator<T>;
    private _findFirst(entry);
    null: any;
}
export default LinkedList;
