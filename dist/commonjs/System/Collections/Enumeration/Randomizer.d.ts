/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { SimpleEnumerableBase } from "./SimpleEnumerableBase";
import { ForEachEnumerable } from "./ForEachEnumerable";
/**
 * Creates a randomized version of the source.
 * Note: An iterator will always require a arrayCopy (buffer) to pull random results one by one.
 */
export declare class Randomizer<T> extends SimpleEnumerableBase<T> {
    private readonly _allowReset;
    private readonly _buffer;
    private _pointer;
    constructor(source: ForEachEnumerable<T>, _allowReset?: boolean);
    protected _canMoveNext(): boolean;
    moveNext(): boolean;
    reset(): void;
    dispose(): void;
    protected getIsEndless(): boolean;
}
