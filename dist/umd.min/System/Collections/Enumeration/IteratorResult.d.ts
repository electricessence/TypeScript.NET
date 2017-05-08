/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { IIteratorResult } from "./IIterator";
export declare class IteratorResult<T> implements IIteratorResult<T> {
    readonly value: T;
    readonly index?: number;
    readonly done: boolean;
    constructor(value: T, done: boolean);
    constructor(value: T, index?: number, done?: boolean);
}
export declare module IteratorResult {
    const Done: IteratorResult<any>;
    function GetDone(): IteratorResult<any>;
}
export default IteratorResult;
