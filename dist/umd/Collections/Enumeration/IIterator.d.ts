/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import IIteratorResult from "./IIteratorResult";
export default interface IIterator<T> {
    next(value?: any): IIteratorResult<T>;
    'return'?<TReturn>(value?: TReturn): IIteratorResult<TReturn>;
    'throw'?(e?: any): IIteratorResult<T>;
}
