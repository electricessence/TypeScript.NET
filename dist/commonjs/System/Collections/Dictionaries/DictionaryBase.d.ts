/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { CollectionBase } from "../CollectionBase";
import { KeyValuePair, KeyValuePairOrTuple } from "../../KeyValuePair";
import { IDictionary } from "./IDictionary";
import { IEnumerator, FiniteEnumerator } from "../Enumeration/IEnumerator";
import { Action } from "../../FunctionTypes";
import FiniteEnumerableOrArrayLike from "../FiniteEnumerableOrArrayLike";
import { FiniteEnumerableOrEnumerator } from "../Enumeration/FiniteEnumerableOrEnumerator";
export declare abstract class DictionaryBase<TKey, TValue> extends CollectionBase<KeyValuePair<TKey, TValue>> implements IDictionary<TKey, TValue> {
    protected constructor(source?: FiniteEnumerableOrArrayLike<KeyValuePair<TKey, TValue>>);
    protected _onValueModified(key: TKey, value: TValue | undefined, old: TValue | undefined): void;
    protected _addInternal(item: KeyValuePairOrTuple<TKey, TValue>): boolean;
    protected _clearInternal(): number;
    contains(item: KeyValuePairOrTuple<TKey, TValue>): boolean;
    protected _removeInternal(item: KeyValuePair<TKey, TValue> | [TKey, TValue]): number;
    protected abstract getKeys(): TKey[];
    readonly keys: TKey[];
    protected abstract getValues(): TValue[];
    readonly values: TValue[];
    addByKeyValue(key: TKey, value: TValue): boolean;
    protected abstract _getEntry(key: TKey): KeyValuePair<TKey, TValue> | null;
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
    importEntries(pairs: FiniteEnumerableOrArrayLike<KeyValuePairOrTuple<TKey, TValue>> | IEnumerator<KeyValuePairOrTuple<TKey, TValue>> | null | undefined): number;
    protected _importEntries(pairs: FiniteEnumerableOrEnumerator<KeyValuePairOrTuple<TKey, TValue>> | null | undefined): number;
    getEnumerator(): FiniteEnumerator<KeyValuePair<TKey, TValue>>;
}
export default DictionaryBase;
