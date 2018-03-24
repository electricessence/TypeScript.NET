/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import IReadOnlyCollection from "./IReadOnlyCollection";
import IEnumerableOrArray from "./IEnumerableOrArray";
import IEnumerator from "./Enumeration/IEnumerator";
export default interface ICollection<T> extends IReadOnlyCollection<T> {
    add(entry: T): this;
    remove(entry: T, max?: number): number;
    clear(): number;
    importEntries(entries: IEnumerableOrArray<T> | IEnumerator<T>): number;
    toArray(): T[];
}
