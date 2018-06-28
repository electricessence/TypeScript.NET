/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { IIterator } from "./IIterator";
import { SimpleEnumerableBase } from "./SimpleEnumerableBase";
/**
 * A simplified stripped down enumerator that until disposed will infinitely return the provided factory.
 * This is analogous to a 'generator' and has a compatible interface.
 *
 *
 */
export declare class IteratorEnumerator<T> extends SimpleEnumerableBase<T> {
    private readonly _iterator;
    private readonly _isEndless?;
    /**
     * @param _iterator
     * @param _isEndless true and false are explicit where as undefined means 'unknown'.
     */
    constructor(_iterator: IIterator<T>, _isEndless?: boolean | undefined);
    protected _canMoveNext(): boolean;
    moveNext(value?: any): boolean;
    dispose(): void;
    protected getIsEndless(): boolean;
}
export default IteratorEnumerator;
