/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { CollectionBase } from "../CollectionBase";
import { IKeyValuePair, KeyValuePair } from "../../KeyValuePair";
import { IDictionary } from "./IDictionary";
import { IEnumerator } from "../Enumeration/IEnumerator";
import { IEnumerableOrArray } from "../IEnumerableOrArray";
export declare abstract class DictionaryBase<TKey, TValue> extends CollectionBase<IKeyValuePair<TKey, TValue>> implements IDictionary<TKey, TValue> {
    constructor(source?: IEnumerableOrArray<IKeyValuePair<TKey, TValue>>);
    protected _onValueModified(key: TKey, value: TValue, old: TValue): void;
    protected _addInternal(item: KeyValuePair<TKey, TValue>): boolean;
    protected _clearInternal(): number;
    contains(item: KeyValuePair<TKey, TValue>): boolean;
    protected _removeInternal(item: IKeyValuePair<TKey, TValue> | [TKey, TValue]): number;
    protected abstract getKeys(): TKey[];
    keys: TKey[];
    protected abstract getValues(): TValue[];
    values: TValue[];
    addByKeyValue(key: TKey, value: TValue): boolean;
    protected abstract _getEntry(key: TKey): IKeyValuePair<TKey, TValue>;
    abstract getValue(key: TKey): TValue;
    protected abstract _setValueInternal(key: TKey, value: TValue): boolean;
    setValue(key: TKey, value: TValue): boolean;
    containsKey(key: TKey): boolean;
    containsValue(value: TValue): boolean;
    removeByKey(key: TKey): boolean;
    removeByValue(value: TValue): number;
    importEntries(pairs: IEnumerableOrArray<KeyValuePair<TKey, TValue>>): number;
    protected _importEntries(pairs: IEnumerableOrArray<KeyValuePair<TKey, TValue>>): number;
    getEnumerator(): IEnumerator<IKeyValuePair<TKey, TValue>>;
}
export default DictionaryBase;
