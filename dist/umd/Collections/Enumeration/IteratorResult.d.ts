/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import IIteratorResult from "./IIteratorResult";
export default class IteratorResult<T> implements IIteratorResult<T> {
    readonly value: T;
    readonly index?: number;
    readonly done: boolean;
    constructor(value: T, done: boolean);
    constructor(value: T, index?: number, done?: boolean);
    static getDone(): IteratorResult<any>;
}
export declare const CompletedIteratorResult: IteratorResult<any>;
