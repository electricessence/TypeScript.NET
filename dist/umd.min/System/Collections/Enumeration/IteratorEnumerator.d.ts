/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { IIterator } from "./IIterator";
import { SimpleEnumerableBase } from "./SimpleEnumerableBase";
export declare class IteratorEnumerator<T> extends SimpleEnumerableBase<T> {
    private _iterator;
    private _isEndless;
    constructor(_iterator: IIterator<T>, _isEndless?: boolean);
    protected canMoveNext(): boolean;
    moveNext(value?: any): boolean;
    dispose(): void;
    protected getIsEndless(): boolean;
}
export default IteratorEnumerator;
