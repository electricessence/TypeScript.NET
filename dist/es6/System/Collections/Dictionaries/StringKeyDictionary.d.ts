/// <reference path="../../../../../source/System/Collections/Dictionaries/IDictionary.d.ts" />
/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import DictionaryBase from "./DictionaryBase";
export default class StringKeyDictionary<TValue> extends DictionaryBase<string, TValue> implements IStringKeyDictionary<TValue> {
    private _count;
    private _map;
    protected _getEntry(key: string): IKeyValuePair<string, TValue>;
    containsKey(key: string): boolean;
    containsValue(value: TValue): boolean;
    getValue(key: string): TValue;
    protected _setValueInternal(key: string, value: TValue): boolean;
    importMap(values: IMap<TValue>): boolean;
    toMap(selector?: (key: string, value: TValue) => TValue): IMap<TValue>;
    protected getKeys(): string[];
    protected getValues(): TValue[];
    protected getCount(): number;
}
