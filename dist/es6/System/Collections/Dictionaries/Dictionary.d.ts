/*!
 * @author electricessence / https://github.com/electricessence/
 * Original: http://linqjs.codeplex.com/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { IKeyValuePair } from "../../KeyValuePair";
import { IEnumerator } from "../Enumeration/IEnumerator";
import { ILinkedNode } from "../ILinkedListNode";
import { HashSelector } from "../../FunctionTypes";
import DictionaryBase from "./DictionaryBase";
export interface IHashEntry<TKey, TValue> extends ILinkedNode<IHashEntry<TKey, TValue>>, IKeyValuePair<TKey, TValue> {
}
export declare class Dictionary<TKey, TValue> extends DictionaryBase<TKey, TValue> {
    private readonly _keyGenerator?;
    private readonly _entries;
    private readonly _buckets;
    constructor(_keyGenerator?: HashSelector<TKey> | undefined);
    protected _onDispose(): void;
    protected getCount(): number;
    private _getBucket;
    private _getBucketEntry;
    protected _getEntry(key: TKey): IHashEntry<TKey, TValue> | null;
    getValue(key: TKey): TValue | undefined;
    protected _setValueInternal(key: TKey, value: TValue | undefined): boolean;
    protected _clearInternal(): number;
    getEnumerator(): IEnumerator<IKeyValuePair<TKey, TValue>>;
    protected getKeys(): TKey[];
    protected getValues(): TValue[];
}
export default Dictionary;
