/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { SetBase } from "./SetBase";
import { ILinkedNodeWithValue } from "./ILinkedListNode";
import { IEnumerableOrArray } from "./IEnumerableOrArray";
import { Selector } from "../FunctionTypes";
export declare class HashSet<T> extends SetBase<T> {
    private readonly _keyGenerator;
    constructor(keyGenerator: Selector<T, string | number | symbol>);
    constructor(source: IEnumerableOrArray<T> | undefined, keyGenerator: Selector<T, string | number | symbol>);
    protected newUsing(source?: IEnumerableOrArray<T>): HashSet<T>;
    private _registry;
    protected _addInternal(item: T): boolean;
    protected _clearInternal(): number;
    protected _onDispose(): void;
    protected _getNode(item: T): ILinkedNodeWithValue<T> | undefined;
    protected _removeInternal(item: T, max?: number): number;
}
export default HashSet;
