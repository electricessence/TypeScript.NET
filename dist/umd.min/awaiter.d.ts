/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
export interface Awaiter {
    (thisArg: any, _arguments: any[], P: PromiseConstructorLike, generator: Function): void;
}
export declare function awaiter(thisArg: any, _arguments: any[], P: PromiseConstructorLike, generator: Function): PromiseLike<{}>;
export declare module awaiter {
    function factory(Promise: PromiseConstructorLike): Awaiter;
}
