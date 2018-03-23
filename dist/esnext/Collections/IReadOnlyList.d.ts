/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
import IReadOnlyCollection from "./IReadOnlyCollection";
export default interface IReadOnlyList<T> extends IReadOnlyCollection<T> {
    get(index: number): T;
    indexOf(item: T): number;
}
