/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
import { FiniteEnumerable } from "./IEnumerable";
import { FiniteEnumerator } from "./IEnumerator";
export default class EmptyEnumerable implements FiniteEnumerable<any> {
    constructor();
    getEnumerator(): FiniteEnumerator<any>;
    /**
     * Provides a way of flagging endless enumerations that may cause issues.
     */
    readonly isEndless: false;
}
