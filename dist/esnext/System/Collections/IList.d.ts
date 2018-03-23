/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import ICollection from "./ICollection";
import IReadOnlyList from "./IReadOnlyList";
export default interface IList<T> extends ICollection<T>, IReadOnlyList<T> {
    set(index: number, value: T): boolean;
    insert(index: number, value: T): void;
    removeAt(index: number): boolean;
}
