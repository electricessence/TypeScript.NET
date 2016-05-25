/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { SimpleEnumerableBase } from "./SimpleEnumerableBase";
export interface InfiniteValueFactory<T> {
    (previous?: T, index?: number): T;
}
export declare class InfiniteEnumerator<T> extends SimpleEnumerableBase<T> {
    private _factory;
    constructor(_factory: InfiniteValueFactory<T>);
    protected canMoveNext(): boolean;
    moveNext(): boolean;
    dispose(): void;
}
export default InfiniteEnumerator;
