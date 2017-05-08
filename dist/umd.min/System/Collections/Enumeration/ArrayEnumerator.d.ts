/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { IndexEnumerator } from "./IndexEnumerator";
export declare class ArrayEnumerator<T> extends IndexEnumerator<T> {
    constructor(arrayFactory: () => ArrayLike<T>, start?: number, step?: number);
    constructor(array: ArrayLike<T>, start?: number, step?: number);
}
export default ArrayEnumerator;
