/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { IDisposable } from "./IDisposable";
export declare type DisposableItem = IDisposable | null | undefined;
export declare type DisposableItemArray = Array<DisposableItem> | null | undefined;
/**
 * Takes any number of disposables as arguments and attempts to dispose them.
 * Any exceptions thrown within a dispose are not trapped.
 * Use 'disposeWithoutException' to automatically trap exceptions.
 *
 * Can accept <any> and will ignore objects that don't have a dispose() method.
 * @param disposables
 */
export declare function dispose(...disposables: DisposableItem[]): void;
export declare module dispose {
    /**
     * Use this when only disposing one object to avoid creation of arrays.
     * @param disposable
     * @param trapExceptions
     */
    function single(disposable: DisposableItem, trapExceptions?: boolean): void;
    function deferred(...disposables: DisposableItem[]): void;
    /**
     * Takes any number of disposables and traps any errors that occur when disposing.
     * Returns an array of the exceptions thrown.
     * @param disposables
     * @returns {any[]} Returns an array of exceptions that occurred, if there are any.
     */
    function withoutException(...disposables: DisposableItem[]): any[] | undefined;
    /**
     * Takes an array of disposable objects and ensures they are disposed.
     * @param disposables
     * @param trapExceptions If true, prevents exceptions from being thrown when disposing.
     * @returns {any[]} If 'trapExceptions' is true, returns an array of exceptions that occurred, if there are any.
     */
    function these(disposables: DisposableItemArray, trapExceptions?: boolean): any[] | undefined;
    module these {
        function deferred(disposables: DisposableItemArray, delay?: number): void;
        /**
         * Use this unsafe method when guaranteed not to cause events that will make modifications to the disposables array.
         * @param disposables
         * @param trapExceptions
         * @returns {any[]}
         */
        function noCopy(disposables: DisposableItemArray, trapExceptions?: boolean): any[] | undefined;
    }
}
/**
 * Just like in C# this 'using' function will ensure the passed disposable is disposed when the closure has finished.
 *
 * Usage:
 * ```typescript
 * using(new DisposableObject(),(myObj)=>{
     *   // do work with myObj
     * });
 * // myObj automatically has it's dispose method called.
 * ```
 *
 * @param disposable Object to be disposed.
 * @param closure Function call to execute.
 * @returns {TReturn} Returns whatever the closure's return value is.
 */
export declare function using<TDisposable extends IDisposable, TReturn>(disposable: TDisposable, closure: (disposable: TDisposable) => TReturn): TReturn;
export default dispose;
