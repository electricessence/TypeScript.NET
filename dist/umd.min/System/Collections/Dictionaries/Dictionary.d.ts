/*!
 * @author electricessence / https://github.com/electricessence/
 * Original: http://linqjs.codeplex.com/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { IKeyValuePair } from "../../KeyValuePair";
import { IEnumerator } from "../Enumeration/IEnumerator";
import { ILinkedNode } from "../ILinkedListNode";
import { Selector } from "../../FunctionTypes";
import DictionaryBase from "./DictionaryBase";
export interface IHashEntry<TKey, TValue> extends ILinkedNode<IHashEntry<TKey, TValue>>, IKeyValuePair<TKey, TValue> {
}
export declare class Dictionary<TKey, TValue> extends DictionaryBase<TKey, TValue> {
    private _keyComparer;
    private _entries;
    private _buckets;
    constructor(_keyComparer?: Selector<TKey, any>);
    protected getCount(): number;
    private _getBucket(hash, createIfMissing?);
    private _getBucketEntry(key, hash?, bucket?);
    protected _getEntry(key: TKey): IHashEntry<TKey, TValue>;
    getValue(key: TKey): TValue;
    protected _setValueInternal(key: TKey, value: TValue): boolean;
    protected _clearInternal(): number;
    getEnumerator(): IEnumerator<IKeyValuePair<TKey, TValue>>;
    protected getKeys(): TKey[];
    protected getValues(): TValue[];
}
export default Dictionary;
