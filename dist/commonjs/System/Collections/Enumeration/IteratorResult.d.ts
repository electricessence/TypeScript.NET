/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { IIteratorResult } from "./IIterator";
export declare class IteratorResult<T> implements IIteratorResult<T> {
    value: T;
    index: number;
    done: boolean;
    constructor(value: T, index?: number, done?: boolean);
}
export declare module IteratorResult {
    const Done: IteratorResult<any>;
    function GetDone(value?: any): IteratorResult<any>;
}
export default IteratorResult;
