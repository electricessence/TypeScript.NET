/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { CollectionBase } from "../CollectionBase";
import { IKeyValuePair, KeyValuePair } from "../../KeyValuePair";
import { IDictionary } from "./IDictionary";
import { IEnumerator } from "../Enumeration/IEnumerator";
import { IEnumerableOrArray } from "../IEnumerableOrArray";
import { Action } from "../../FunctionTypes";
export declare abstract class DictionaryBase<TKey, TValue> extends CollectionBase<IKeyValuePair<TKey, TValue>> implements IDictionary<TKey, TValue> {
    protected constructor(source?: IEnumerableOrArray<IKeyValuePair<TKey, TValue>>);
    protected _onValueModified(key: TKey, value: TValue | undefined, old: TValue | undefined): void;
    protected _addInternal(item: KeyValuePair<TKey, TValue>): boolean;
    protected _clearInternal(): number;
    contains(item: KeyValuePair<TKey, TValue>): boolean;
    protected _removeInternal(item: IKeyValuePair<TKey, TValue> | [TKey, TValue]): number;
    protected abstract getKeys(): TKey[];
    readonly keys: TKey[];
    protected abstract getValues(): TValue[];
    readonly values: TValue[];
    addByKeyValue(key: TKey, value: TValue): boolean;
    protected abstract _getEntry(key: TKey): IKeyValuePair<TKey, TValue> | null;
    abstract getValue(key: TKey): TValue | undefined;
    getAssuredValue(key: TKey): TValue;
    tryGetValue(key: TKey, out: Action<TValue>): boolean;
    protected abstract _setValueInternal(key: TKey, value: TValue | undefined): boolean;
    /**
     * Sets the value of an entry.
     * It's important to know that 'undefined' cannot exist as a value in the dictionary and is used as a flag for removal.
     * @param key
     * @param value
     * @returns {boolean}
     */
    setValue(key: TKey, value: TValue | undefined): boolean;
    containsKey(key: TKey): boolean;
    containsValue(value: TValue): boolean;
    removeByKey(key: TKey): boolean;
    removeByValue(value: TValue): number;
    importEntries(pairs: IEnumerableOrArray<KeyValuePair<TKey, TValue>> | IEnumerator<KeyValuePair<TKey, TValue>> | null | undefined): number;
    protected _importEntries(pairs: IEnumerableOrArray<KeyValuePair<TKey, TValue>> | IEnumerator<KeyValuePair<TKey, TValue>> | null | undefined): number;
    getEnumerator(): IEnumerator<IKeyValuePair<TKey, TValue>>;
}
export default DictionaryBase;
