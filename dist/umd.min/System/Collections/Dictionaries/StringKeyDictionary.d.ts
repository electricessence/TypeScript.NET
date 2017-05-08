/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { IMap, IStringKeyDictionary } from "./IDictionary";
import { IKeyValuePair } from "../../KeyValuePair";
import { DictionaryBase } from "./DictionaryBase";
export declare class StringKeyDictionary<TValue> extends DictionaryBase<string, TValue> implements IStringKeyDictionary<TValue> {
    protected _onDispose(): void;
    private _count;
    private readonly _map;
    protected _getEntry(key: string): IKeyValuePair<string, TValue> | null;
    containsKey(key: string): boolean;
    containsValue(value: TValue): boolean;
    getValue(key: string): TValue | undefined;
    protected _setValueInternal(key: string, value: TValue | undefined): boolean;
    importMap(values: IMap<TValue>): boolean;
    toMap(selector?: (key: string, value: TValue) => TValue): IMap<TValue>;
    protected getKeys(): string[];
    protected getValues(): TValue[];
    protected getCount(): number;
}
export default StringKeyDictionary;
