/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { KeyValuePair, IKeyValuePair } from "./KeyValuePair";
import { IArray } from "./Collections/Array/IArray";
export declare function isKeyValuePair<TKey, TValue>(kvp: any): kvp is IKeyValuePair<TKey, TValue>;
export declare function assertKey<TKey>(key: TKey, name?: string): TKey;
export declare function assertTuple(tuple: IArray<any>, name?: string): void;
export declare function assertNotUndefined<T>(value: T, name: string): T;
export declare function extractKeyValue<TKey, TValue, TResult>(item: KeyValuePair<TKey, TValue>, to: (key: TKey, value: TValue) => TResult): TResult;
export default extractKeyValue;
