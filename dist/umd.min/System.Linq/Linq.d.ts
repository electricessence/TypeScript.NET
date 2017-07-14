/*!
 * @author electricessence / https://github.com/electricessence/
 * Original: http://linqjs.codeplex.com/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { DisposableBase } from "../System/Disposable/DisposableBase";
import { IEnumerator } from "../System/Collections/Enumeration/IEnumerator";
import { Action, ActionWithIndex, Closure, Comparison, EqualityComparison, PredicateWithIndex, Selector, SelectorWithIndex } from "../System/FunctionTypes";
import { IDictionary, IMap } from "../System/Collections/Dictionaries/IDictionary";
import { Comparable } from "../System/IComparable";
import { IFiniteEnumerable, IGrouping, IInfiniteEnumerable, ILinqEnumerable, ILookup, IOrderedEnumerable, NotEmptyEnumerable } from "./Enumerable";
import { EnumerableAction } from "./EnumerableAction";
import { Primitive } from "../System/Primitive";
import { ForEachEnumerable } from "../System/Collections/Enumeration/ForEachEnumerable";
import { InfiniteValueFactory } from "../System/Collections/Enumeration/InfiniteEnumerator";
export declare class InfiniteLinqEnumerable<T> extends DisposableBase implements IInfiniteEnumerable<T> {
    protected _enumeratorFactory: () => IEnumerator<T>;
    constructor(_enumeratorFactory: () => IEnumerator<T>, finalizer?: Closure | null);
    protected _isEndless: boolean | undefined;
    readonly isEndless: boolean | undefined;
    getEnumerator(): IEnumerator<T>;
    protected _onDispose(): void;
    asEnumerable(): this;
    /**
     * Similar to forEach, but executes an action for each time a value is enumerated.
     * If the action explicitly returns false or 0 (EnumerationAction.Break), the enumeration will complete.
     * If it returns a 2 (EnumerationAction.Skip) it will move on to the next item.
     * This also automatically handles disposing the enumerator.
     * @param action
     * @param initializer
     * @param isEndless Special case where isEndless can be null in order to negate inheritance.
     * @param onComplete Executes just before the enumerator releases when there is no more entries.
     * @returns {any}
     */
    doAction(action: ActionWithIndex<T> | PredicateWithIndex<T> | SelectorWithIndex<T, number> | SelectorWithIndex<T, EnumerableAction>, initializer: Closure | null, isEndless: true, onComplete?: Action<number>): InfiniteLinqEnumerable<T>;
    doAction(action: ActionWithIndex<T> | PredicateWithIndex<T> | SelectorWithIndex<T, number> | SelectorWithIndex<T, EnumerableAction>, initializer?: Closure | null, isEndless?: boolean | null | undefined, onComplete?: Action<number>): LinqEnumerable<T>;
    force(): void;
    skip(count: number): InfiniteLinqEnumerable<T>;
    take(count: number): FiniteEnumerable<T>;
    elementAt(index: number): T;
    elementAtOrDefault(index: number): T | undefined;
    elementAtOrDefault(index: number, defaultValue: T): T;
    first(): T;
    firstOrDefault(): T | undefined;
    firstOrDefault(defaultValue: T): T;
    single(): T;
    singleOrDefault(): T | undefined;
    singleOrDefault(defaultValue: T): T;
    any(): boolean;
    isEmpty(): boolean;
    traverseDepthFirst(childrenSelector: (element: T) => ForEachEnumerable<T> | null | undefined): LinqEnumerable<T>;
    traverseDepthFirst<TNode>(childrenSelector: (element: T | TNode) => ForEachEnumerable<TNode> | null | undefined): LinqEnumerable<TNode>;
    traverseDepthFirst<TResult>(childrenSelector: (element: T) => ForEachEnumerable<T> | null | undefined, resultSelector: SelectorWithIndex<T, TResult>): LinqEnumerable<TResult>;
    traverseDepthFirst<TNode, TResult>(childrenSelector: (element: T | TNode) => ForEachEnumerable<TNode> | null | undefined, resultSelector: SelectorWithIndex<T, TResult>): LinqEnumerable<TResult>;
    flatten<TFlat>(): InfiniteLinqEnumerable<TFlat>;
    flatten(): InfiniteLinqEnumerable<any>;
    pairwise<TSelect>(selector: (previous: T, current: T, index: number) => TSelect): InfiniteLinqEnumerable<TSelect>;
    scan(func: (previous: T, current: T, index: number) => T, seed?: T): this;
    select<TResult>(selector: SelectorWithIndex<T, TResult>): InfiniteLinqEnumerable<TResult>;
    map<TResult>(selector: SelectorWithIndex<T, TResult>): InfiniteLinqEnumerable<TResult>;
    protected _selectMany<TElement, TResult>(collectionSelector: SelectorWithIndex<T, ForEachEnumerable<TElement> | null | undefined>, resultSelector?: (collection: T, element: TElement) => TResult): LinqEnumerable<TResult>;
    selectMany<TResult>(collectionSelector: SelectorWithIndex<T, ForEachEnumerable<TResult> | null | undefined>): InfiniteLinqEnumerable<TResult>;
    selectMany<TElement, TResult>(collectionSelector: SelectorWithIndex<T, ForEachEnumerable<TElement> | null | undefined>, resultSelector: (collection: T, element: TElement) => TResult): InfiniteLinqEnumerable<TResult>;
    protected _filterSelected(selector?: SelectorWithIndex<T, T>, filter?: PredicateWithIndex<T>): LinqEnumerable<T>;
    protected _filterSelected<TResult>(selector: SelectorWithIndex<T, TResult>, filter?: PredicateWithIndex<TResult>): LinqEnumerable<TResult>;
    /**
     * Returns selected values that are not null or undefined.
     */
    choose(): InfiniteLinqEnumerable<T>;
    choose<TResult>(selector?: Selector<T, TResult>): InfiniteLinqEnumerable<TResult>;
    where(predicate: PredicateWithIndex<T>): this;
    filter(predicate: PredicateWithIndex<T>): this;
    nonNull(): this;
    ofType<TType>(type: {
        new (...params: any[]): TType;
    }): InfiniteLinqEnumerable<TType>;
    except(second: ForEachEnumerable<T>, compareSelector?: Selector<T, string | number | symbol>): this;
    distinct(compareSelector?: Selector<T, string | number | symbol>): this;
    distinctUntilChanged(compareSelector?: Selector<T, any>): this;
    /**
     * Returns a single default value if empty.
     * @param defaultValue
     * @returns {Enumerable}
     */
    defaultIfEmpty(defaultValue?: T): this;
    zip<TSecond, TResult>(second: ForEachEnumerable<TSecond>, resultSelector: (first: T, second: TSecond, index: number) => TResult): LinqEnumerable<TResult>;
    zipMultiple<TSecond, TResult>(second: ArrayLike<ForEachEnumerable<TSecond>>, resultSelector: (first: T, second: TSecond, index: number) => TResult): LinqEnumerable<TResult>;
    join<TInner, TKey, TResult>(inner: ForEachEnumerable<TInner>, outerKeySelector: Selector<T, TKey>, innerKeySelector: Selector<TInner, TKey>, resultSelector: (outer: T, inner: TInner) => TResult, compareSelector?: Selector<TKey, string | number | symbol>): LinqEnumerable<TResult>;
    groupJoin<TInner, TKey, TResult>(inner: ForEachEnumerable<TInner>, outerKeySelector: Selector<T, TKey>, innerKeySelector: Selector<TInner, TKey>, resultSelector: (outer: T, inner: TInner[] | null) => TResult, compareSelector?: Selector<TKey, string | number | symbol>): LinqEnumerable<TResult>;
    merge(enumerables: ArrayLike<ForEachEnumerable<T>>): this;
    concat(...enumerables: Array<ForEachEnumerable<T>>): this;
    union(second: ForEachEnumerable<T>, compareSelector?: Selector<T, string | number | symbol>): this;
    insertAt(index: number, other: ForEachEnumerable<T>): this;
    alternateMultiple(sequence: ForEachEnumerable<T>): this;
    alternateSingle(value: T): this;
    alternate(...sequence: T[]): this;
    catchError(handler: (e: any) => void): this;
    finallyAction(action: Closure): this;
    buffer(size: number): InfiniteLinqEnumerable<T[]>;
    share(): this;
}
/**
 * Enumerable<T> is a wrapper class that allows more primitive enumerables to exhibit LINQ behavior.
 *
 * In C# Enumerable<T> is not an instance but has extensions for IEnumerable<T>.
 * In this case, we use Enumerable<T> as the underlying class that is being chained.
 */
export declare class LinqEnumerable<T> extends InfiniteLinqEnumerable<T> implements ILinqEnumerable<T> {
    constructor(enumeratorFactory: () => IEnumerator<T>, finalizer?: Closure | null, isEndless?: boolean);
    asEnumerable(): this;
    skip(count: number): LinqEnumerable<T>;
    skipWhile(predicate: PredicateWithIndex<T>): LinqEnumerable<T>;
    takeWhile(predicate: PredicateWithIndex<T>): this;
    takeUntil(predicate: PredicateWithIndex<T>, includeUntilValue?: boolean): this;
    traverseBreadthFirst(childrenSelector: (element: T) => ForEachEnumerable<T> | null | undefined): LinqEnumerable<T>;
    traverseBreadthFirst<TNode>(childrenSelector: (element: T | TNode) => ForEachEnumerable<TNode> | null | undefined): LinqEnumerable<TNode>;
    traverseBreadthFirst<TResult>(childrenSelector: (element: T) => ForEachEnumerable<T> | null | undefined, resultSelector: SelectorWithIndex<T, TResult>): LinqEnumerable<TResult>;
    traverseBreadthFirst<TNode, TResult>(childrenSelector: (element: T | TNode) => ForEachEnumerable<TNode> | null | undefined, resultSelector: SelectorWithIndex<T, TResult>): LinqEnumerable<TResult>;
    forEach(action: ActionWithIndex<T>, max?: number): number;
    forEach(action: PredicateWithIndex<T>, max?: number): number;
    toArray(predicate?: PredicateWithIndex<T>): T[];
    copyTo(target: T[], index?: number, count?: number): T[];
    toLookup<TKey, TValue>(keySelector: SelectorWithIndex<T, TKey>, elementSelector?: SelectorWithIndex<T, TValue>, compareSelector?: Selector<TKey, string | number | symbol>): ILookup<TKey, TValue>;
    toMap<TResult>(keySelector: SelectorWithIndex<T, string | number | symbol>, elementSelector: SelectorWithIndex<T, TResult>): IMap<TResult>;
    toDictionary<TKey, TValue>(keySelector: SelectorWithIndex<T, TKey>, elementSelector: SelectorWithIndex<T, TValue>, compareSelector?: Selector<TKey, string | number | symbol>): IDictionary<TKey, TValue>;
    toJoinedString(separator?: string, selector?: Selector<T, string>): string;
    takeExceptLast(count?: number): this;
    skipToLast(count: number): this;
    select<TResult>(selector: SelectorWithIndex<T, TResult>): LinqEnumerable<TResult>;
    map<TResult>(selector: SelectorWithIndex<T, TResult>): LinqEnumerable<TResult>;
    selectMany<TResult>(collectionSelector: SelectorWithIndex<T, ForEachEnumerable<TResult> | null | undefined>): LinqEnumerable<TResult>;
    selectMany<TElement, TResult>(collectionSelector: SelectorWithIndex<T, ForEachEnumerable<TElement> | null | undefined>, resultSelector: (collection: T, element: TElement) => TResult): LinqEnumerable<TResult>;
    choose(): LinqEnumerable<T>;
    choose<TResult>(selector: SelectorWithIndex<T, TResult>): LinqEnumerable<TResult>;
    reverse(): this;
    shuffle(): this;
    count(predicate?: PredicateWithIndex<T>): number;
    all(predicate: PredicateWithIndex<T>): boolean;
    every(predicate: PredicateWithIndex<T>): boolean;
    any(predicate?: PredicateWithIndex<T>): boolean;
    some(predicate?: PredicateWithIndex<T>): boolean;
    contains(value: T, compareSelector?: Selector<T, any>): boolean;
    indexOf(value: T, compareSelector?: SelectorWithIndex<T, any>): number;
    lastIndexOf(value: T, compareSelector?: SelectorWithIndex<T, any>): number;
    intersect(second: ForEachEnumerable<T>, compareSelector?: Selector<T, string | number | symbol>): this;
    sequenceEqual(second: ForEachEnumerable<T>, equalityComparer?: EqualityComparison<T>): boolean;
    ofType<TType>(type: {
        new (...params: any[]): TType;
    }): LinqEnumerable<TType>;
    orderBy<TKey extends Comparable>(keySelector?: Selector<T, TKey>): IOrderedEnumerable<T>;
    orderUsing(comparison: Comparison<T>): IOrderedEnumerable<T>;
    orderUsingReversed(comparison: Comparison<T>): IOrderedEnumerable<T>;
    orderByDescending<TKey extends Comparable>(keySelector?: Selector<T, TKey>): IOrderedEnumerable<T>;
    buffer(size: number): LinqEnumerable<T[]>;
    groupBy<TKey>(keySelector: SelectorWithIndex<T, TKey>): LinqEnumerable<IGrouping<TKey, T>>;
    groupBy<TKey>(keySelector: SelectorWithIndex<T, TKey>, elementSelector: SelectorWithIndex<T, T>, compareSelector?: Selector<TKey, string | number | symbol>): LinqEnumerable<IGrouping<TKey, T>>;
    groupBy<TKey, TElement>(keySelector: SelectorWithIndex<T, TKey>, elementSelector: SelectorWithIndex<T, TElement>, compareSelector?: Selector<TKey, string | number | symbol>): LinqEnumerable<IGrouping<TKey, TElement>>;
    partitionBy<TKey>(keySelector: Selector<T, TKey>): LinqEnumerable<IGrouping<TKey, T>>;
    partitionBy<TKey, TElement>(keySelector: Selector<T, TKey>, elementSelector?: Selector<T, TElement>, resultSelector?: (key: TKey, element: TElement[]) => IGrouping<TKey, TElement>, compareSelector?: Selector<TKey, any>): LinqEnumerable<IGrouping<TKey, TElement>>;
    flatten<TFlat>(): LinqEnumerable<TFlat>;
    flatten(): LinqEnumerable<any>;
    pairwise<TSelect>(selector: (previous: T, current: T, index: number) => TSelect): LinqEnumerable<TSelect>;
    aggregate(reduction: (previous: T, current: T, index?: number) => T): T | undefined;
    aggregate<U>(reduction: (previous: U, current: T, index?: number) => U, initialValue: U): U;
    reduce<T>(reduction: (previous: T, current: T, index?: number) => T): T | undefined;
    reduce<U>(reduction: (previous: U, current: T, index?: number) => U, initialValue: U): U;
    average(selector?: SelectorWithIndex<T, number>): number;
    max(): T | undefined;
    min(): T | undefined;
    maxBy(keySelector?: Selector<T, Primitive>): T | undefined;
    minBy(keySelector?: Selector<T, Primitive>): T | undefined;
    sum(selector?: SelectorWithIndex<T, number>): number;
    product(selector?: SelectorWithIndex<T, number>): number;
    /**
     * Takes the first number and divides it by all following.
     * @param selector
     * @returns {number}
     */
    quotient(selector?: SelectorWithIndex<T, number>): number;
    last(): T;
    lastOrDefault(): T | undefined;
    lastOrDefault(defaultValue: T): T;
    memoize(): this;
    throwWhenEmpty(): NotEmptyEnumerable<T>;
}
export declare class FiniteEnumerable<T> extends LinqEnumerable<T> implements IFiniteEnumerable<T> {
    constructor(enumeratorFactory: () => IEnumerator<T>, finalizer?: Closure);
}
export declare function Enumerable<T>(source: InfiniteValueFactory<T>): InfiniteLinqEnumerable<T>;
export declare function Enumerable<T>(source: ForEachEnumerable<T>, ...additional: Array<ForEachEnumerable<T>>): LinqEnumerable<T>;
export declare module Enumerable {
    /**
     * Universal method for converting a primitive enumerables into a LINQ enabled ones.
     *
     * Is not limited to TypeScript usages.
     */
    function from<T>(source: InfiniteValueFactory<T>): InfiniteLinqEnumerable<T>;
    function from<T>(source: ForEachEnumerable<T>, ...additional: Array<ForEachEnumerable<T>>): LinqEnumerable<T>;
    function fromAny<T>(source: InfiniteValueFactory<T>): InfiniteLinqEnumerable<T>;
    function fromAny<T>(source: ForEachEnumerable<T>): LinqEnumerable<T>;
    function fromAny(source: any): LinqEnumerable<any> | undefined;
    function fromAny<T>(source: ForEachEnumerable<T>, defaultEnumerable: LinqEnumerable<T>): LinqEnumerable<T>;
    function fromThese<T>(sources: ForEachEnumerable<T>[]): LinqEnumerable<T>;
    function fromOrEmpty<T>(source: ForEachEnumerable<T>): LinqEnumerable<T>;
    /**
     * Static helper for converting enumerables to an array.
     * @param source
     * @returns {any}
     */
    function toArray<T>(source: ForEachEnumerable<T>): T[];
    function _choice<T>(values: T[]): InfiniteLinqEnumerable<T>;
    function choice<T>(values: ArrayLike<T>): InfiniteLinqEnumerable<T>;
    function chooseFrom<T>(arg: T, ...args: T[]): InfiniteLinqEnumerable<T>;
    function cycle<T>(values: ArrayLike<T>): InfiniteLinqEnumerable<T>;
    function cycleThrough<T>(arg: T, ...args: T[]): InfiniteLinqEnumerable<T>;
    function empty<T>(): FiniteEnumerable<T>;
    function repeat<T>(element: T): InfiniteLinqEnumerable<T>;
    function repeat<T>(element: T, count: number): FiniteEnumerable<T>;
    /**
     * DEPRECATED This method began to not make sense in so many ways.
     * @deprecated since version 4.2
     * @param initializer
     * @param finalizer
     */
    function repeatWithFinalize<T>(initializer: () => T, finalizer: Closure): InfiniteLinqEnumerable<T>;
    function repeatWithFinalize<T>(initializer: () => T, finalizer?: Action<T>): InfiniteLinqEnumerable<T>;
    /**
     * Creates an enumerable of one element.
     * @param element
     * @returns {FiniteEnumerable<T>}
     */
    function make<T>(element: T): FiniteEnumerable<T>;
    function range(start: number, count: number, step?: number): FiniteEnumerable<number>;
    function rangeDown(start: number, count: number, step?: number): FiniteEnumerable<number>;
    function toInfinity(start?: number, step?: number): InfiniteLinqEnumerable<number>;
    function toNegativeInfinity(start?: number, step?: number): InfiniteLinqEnumerable<number>;
    function rangeTo(start: number, to: number, step?: number): FiniteEnumerable<number>;
    function matches(input: string, pattern: any, flags?: string): FiniteEnumerable<RegExpExecArray>;
    function generate<T>(factory: () => T): InfiniteLinqEnumerable<T>;
    function generate<T>(factory: () => T, count: number): FiniteEnumerable<T>;
    function generate<T>(factory: (index: number) => T): InfiniteLinqEnumerable<T>;
    function generate<T>(factory: (index: number) => T, count: number): FiniteEnumerable<T>;
    module random {
        function floats(maxExclusive?: number): InfiniteLinqEnumerable<number>;
        function integers(boundary: number, inclusive?: boolean): InfiniteLinqEnumerable<number>;
    }
    function unfold<T>(seed: T, valueFactory: SelectorWithIndex<T, T>, skipSeed?: Boolean): InfiniteLinqEnumerable<T>;
    function forEach<T>(e: ForEachEnumerable<T>, action: ActionWithIndex<T>, max?: number): number;
    function forEach<T>(e: ForEachEnumerable<T>, action: PredicateWithIndex<T>, max?: number): number;
    function map<T, TResult>(enumerable: ForEachEnumerable<T>, selector: SelectorWithIndex<T, TResult>): TResult[];
    function max(values: FiniteEnumerable<number>): number;
    function min(values: FiniteEnumerable<number>): number;
    /**
     * Takes any set of collections of the same type and weaves them together.
     * @param enumerables
     * @returns {Enumerable<T>}
     */
    function weave<T>(enumerables: ForEachEnumerable<ForEachEnumerable<T>>): LinqEnumerable<T>;
}
export default Enumerable;
