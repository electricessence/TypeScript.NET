/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { SetBase } from "./SetBase";
import { ILinkedNodeWithValue } from "./ILinkedListNode";
import { Primitive } from "../Primitive";
import { IEnumerableOrArray } from "./IEnumerableOrArray";
export declare class Set<T extends Primitive> extends SetBase<T> {
    protected newUsing(source?: IEnumerableOrArray<T>): Set<T>;
    private _registry;
    protected _addInternal(item: T): boolean;
    protected _clearInternal(): number;
    protected _onDispose(): void;
    protected _getNode(item: T): ILinkedNodeWithValue<T>;
    protected _removeInternal(item: T, max?: number): number;
}
export default Set;
