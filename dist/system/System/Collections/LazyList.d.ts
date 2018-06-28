/*!
 * @author electricessence / https://github.com/electricessence/
 * Origin: http://www.fallingcanbedeadly.com/
 * Licensing: MIT
 */
import { IEnumerator } from "./Enumeration/IEnumerator";
import { ReadOnlyCollectionBase } from "./ReadOnlyCollectionBase";
import { IEnumerable } from "./Enumeration/IEnumerable";
import { IReadOnlyList } from "./IList";
export declare class LazyList<T> extends ReadOnlyCollectionBase<T> implements IReadOnlyList<T> {
    private _enumerator;
    private _cached;
    constructor(source: IEnumerable<T>);
    protected _onDispose(): void;
    protected _getCount(): number;
    protected _getEnumerator(): IEnumerator<T>;
    get(index: number): T;
    indexOf(item: T): number;
    contains(item: T): boolean;
    private getNext;
    private finish;
}
