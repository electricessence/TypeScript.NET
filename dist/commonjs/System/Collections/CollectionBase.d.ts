/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { DisposableBase } from "../Disposable/DisposableBase";
import { ICollection } from "./ICollection";
import { IEnumerator } from "./Enumeration/IEnumerator";
import { IEnumerateEach } from "./Enumeration/IEnumerateEach";
import { Action, ActionWithIndex, EqualityComparison, PredicateWithIndex } from "../FunctionTypes";
import { IEnumerableOrArray } from "./IEnumerableOrArray";
import { ArrayLikeWritable } from "./Array/ArrayLikeWritable";
import { LinqEnumerable } from "../../System.Linq/Linq";
export declare abstract class CollectionBase<T> extends DisposableBase implements ICollection<T>, IEnumerateEach<T> {
    protected _equalityComparer: EqualityComparison<T>;
    protected constructor(source?: IEnumerableOrArray<T> | IEnumerator<T>, _equalityComparer?: EqualityComparison<T>);
    protected abstract getCount(): number;
    readonly count: number;
    protected getIsReadOnly(): boolean;
    readonly isReadOnly: boolean;
    protected assertModifiable(): true | never;
    protected _version: number;
    protected assertVersion(version: number): true | never;
    private _modifiedCount;
    private _updateRecursion;
    protected _onModified(): void;
    protected _signalModification(increment?: boolean): boolean;
    protected _incrementModified(): void;
    readonly isUpdating: boolean;
    /**
     * Takes a closure that if returning true will propagate an update signal.
     * Multiple update operations can be occurring at once or recursively and the onModified signal will only occur once they're done.
     * @param closure
     * @returns {boolean}
     */
    handleUpdate(closure?: () => boolean): boolean;
    protected abstract _addInternal(entry: T): boolean;
    /**
     * Adds an entry to the collection.
     * @param entry
     */
    add(entry: T): this;
    protected abstract _removeInternal(entry: T, max?: number): number;
    /**
     * Removes entries from the collection allowing for a limit.
     * For example if the collection not a distinct set, more than one entry could be removed.
     * @param entry The entry to remove.
     * @param max Limit of entries to remove.  Will remove all matches if no max specified.
     * @returns {number} The number of entries removed.
     */
    remove(entry: T, max?: number): number;
    protected abstract _clearInternal(): number;
    /**
     * Clears the contents of the collection resulting in a count of zero.
     * @returns {number}
     */
    clear(): number;
    protected _onDispose(): void;
    protected _importEntries(entries: IEnumerableOrArray<T> | IEnumerator<T> | null | undefined): number;
    /**
     * Safely imports any array enumerator, or enumerable.
     * @param entries
     * @returns {number}
     */
    importEntries(entries: IEnumerableOrArray<T> | IEnumerator<T>): number;
    /**
     * Returns a enumerator for this collection.
     */
    abstract getEnumerator(): IEnumerator<T>;
    /**
     * Returns an array filtered by the provided predicate.
     * Provided for similarity to JS Array.
     * @param predicate
     * @returns {[]}
     */
    filter(predicate: PredicateWithIndex<T>): T[];
    /**
     * Returns true the first time predicate returns true.  Otherwise false.
     * Useful for searching through a collection.
     * @param predicate
     * @returns {any}
     */
    any(predicate?: PredicateWithIndex<T>): boolean;
    /**
     * Returns true the first time predicate returns true.  Otherwise false.
     * See '.any(predicate)'.  As this method is just just included to have similarity with a JS Array.
     * @param predicate
     * @returns {any}
     */
    some(predicate?: PredicateWithIndex<T>): boolean;
    /**
     * Returns true if the equality comparer resolves true on any element in the collection.
     * @param entry
     * @returns {boolean}
     */
    contains(entry: T): boolean;
    /**
     * Special implementation of 'forEach': If the action returns 'false' the enumeration will stop.
     * @param action
     * @param useCopy
     */
    forEach(action: ActionWithIndex<T>, useCopy?: boolean): number;
    forEach(action: PredicateWithIndex<T>, useCopy?: boolean): number;
    /**
     * Copies all values to numerically indexable object.
     * @param target
     * @param index
     * @returns {TTarget}
     */
    copyTo<TTarget extends ArrayLikeWritable<T>>(target: TTarget, index?: number): TTarget;
    /**
     * Returns an array of the collection contents.
     * @returns {any[]|Array}
     */
    toArray(): T[];
    private _linq?;
    /**
     * .linq will return an LinqEnumerable if .linqAsync() has completed successfully or the default module loader is NodeJS+CommonJS.
     * @returns {LinqEnumerable}
     */
    readonly linq: LinqEnumerable<T>;
    /**
     * .linqAsync() is for use with deferred loading.
     * Ensures an instance of the Linq extensions is available and then passes it to the callback.
     * Returns an LinqEnumerable if one is already available, otherwise undefined.
     * Passing no parameters will still initiate loading and initializing the LinqEnumerable which can be useful for pre-loading.
     * Any call to .linqAsync() where an LinqEnumerable is returned can be assured that any subsequent calls to .linq will return the same instance.
     * @param callback
     * @returns {LinqEnumerable}
     */
    linqAsync(callback?: Action<LinqEnumerable<T>>): LinqEnumerable<T> | undefined;
}
