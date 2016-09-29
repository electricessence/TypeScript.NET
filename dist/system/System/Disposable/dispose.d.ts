/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { IDisposable } from "./IDisposable";
export declare type DisposableItem = IDisposable | null | undefined;
export declare type DisposableItemArray = Array<DisposableItem> | null | undefined;
export declare function dispose(...disposables: DisposableItem[]): void;
export declare module dispose {
    function deferred(...disposables: DisposableItem[]): void;
    function withoutException(...disposables: DisposableItem[]): any[] | undefined;
    function these(disposables: DisposableItemArray, trapExceptions?: boolean): any[] | undefined;
    module these {
        function deferred(disposables: DisposableItemArray, delay?: number): void;
    }
}
export declare function using<TDisposable extends IDisposable, TReturn>(disposable: TDisposable, closure: (disposable: TDisposable) => TReturn): TReturn;
export default dispose;
