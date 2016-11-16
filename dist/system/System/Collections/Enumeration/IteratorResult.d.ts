import { IIteratorResult } from "./IIterator";
export declare class IteratorResult<T> implements IIteratorResult<T> {
    value: T;
    index: number;
    done: boolean;
    constructor(value: T, index?: number, done?: boolean);
}
export declare module IteratorResult {
    const Done: IteratorResult<any>;
    function GetDone(): IteratorResult<any>;
}
export default IteratorResult;
