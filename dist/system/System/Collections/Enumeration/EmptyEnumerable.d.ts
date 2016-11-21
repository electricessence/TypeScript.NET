/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
import { IEnumerable } from "./IEnumerable";
import { IEnumerator } from "./IEnumerator";
export declare class EmptyEnumerable implements IEnumerable<any> {
    constructor();
    getEnumerator(): IEnumerator<any>;
    /**
     * Provides a way of flagging endless enumerations that may cause issues.
     */
    readonly isEndless: boolean;
}
