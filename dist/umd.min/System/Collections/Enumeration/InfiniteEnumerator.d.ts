/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { SimpleEnumerableBase } from "./SimpleEnumerableBase";
/**
 * An aggregate/reduce style factory function that expects a previous value and the current index of the enumeration.
 */
export interface InfiniteValueFactory<T> {
    (previous: T | undefined, index: number): T;
}
/**
 * A simplified stripped down enumerator that until disposed will infinitely return the provided factory.
 * This is analogous to a 'generator' and has a compatible interface.
 */
export declare class InfiniteEnumerator<T> extends SimpleEnumerableBase<T> {
    private readonly _factory;
    /**
     * See InfiniteValueFactory
     * @param _factory
     */
    constructor(_factory: InfiniteValueFactory<T>);
    protected _canMoveNext(): boolean;
    moveNext(): boolean;
    dispose(): void;
}
export default InfiniteEnumerator;
