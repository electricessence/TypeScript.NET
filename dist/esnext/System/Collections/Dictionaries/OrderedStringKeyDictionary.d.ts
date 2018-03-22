/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { StringKeyDictionary } from "./StringKeyDictionary";
import { IOrderedDictionary } from "./IDictionary";
export declare class OrderedStringKeyDictionary<TValue> extends StringKeyDictionary<TValue> implements IOrderedDictionary<string, TValue> {
    private _order;
    constructor();
    indexOfKey(key: string): number;
    getValueByIndex(index: number): TValue;
    setValue(key: string, value: TValue | undefined, keepIndex?: boolean): boolean;
    setByIndex(index: number, value: TValue | undefined): boolean;
    importValues(values: TValue[]): boolean;
    setValues(...values: TValue[]): boolean;
    removeByIndex(index: number): boolean;
    protected getKeys(): string[];
}
export default OrderedStringKeyDictionary;
