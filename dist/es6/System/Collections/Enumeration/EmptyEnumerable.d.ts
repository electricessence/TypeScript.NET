/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
import { IEnumerable } from "./IEnumerable";
import { IEnumerator } from "./IEnumerator";
export declare class EmptyEnumerable implements IEnumerable<any> {
    constructor();
    getEnumerator(): IEnumerator<any>;
    readonly isEndless: boolean;
}
