/// <reference path="../../build/System.d.ts" />
declare module System.Linq {
    import Predicate = System.Predicate;
    import Selector = System.Selector;
    import Action = System.Action;
    import IEnumerable = System.Collections.IEnumerable;
    import IMap = System.Collections.IMap;
    import Dictionary = System.Collections.Dictionary;
    enum EnumerableAction {
        Break = 0,
        Return = 1,
        Skip = 2,
    }
    class Enumerable<T> extends System.DisposableBase implements IEnumerable<T> {
        private enumeratorFactory;
        constructor(enumeratorFactory: () => System.Collections.IEnumerator<T>, finalizer?: () => void);
        static fromArray<T>(array: System.Collections.IArray<T>): ArrayEnumerable<T>;
        static from<T>(source: any): Enumerable<T>;
        static toArray<T>(source: any): T[];
        getEnumerator(): System.Collections.IEnumerator<T>;
        protected _onDispose(): void;
        static choice<T>(values: System.Collections.IArray<T>): Enumerable<T>;
        static cycle<T>(values: System.Collections.IArray<T>): Enumerable<T>;
        static empty<T>(): Enumerable<T>;
        static repeat<T>(element: T, count?: number): Enumerable<T>;
        static repeatWithFinalize<T>(initializer: () => T, finalizer: (element: T) => void): Enumerable<T>;
        static make<T>(element: T): Enumerable<T>;
        static range(start?: number, count?: number, step?: number): Enumerable<number>;
        static rangeDown(start?: number, count?: number, step?: number): Enumerable<number>;
        static toInfinity(start?: number, step?: number): Enumerable<number>;
        static toNegativeInfinity(start?: number, step?: number): Enumerable<number>;
        static rangeTo(start?: number, to?: number, step?: number): Enumerable<number>;
        static matches(input: string, pattern: any, flags?: string): Enumerable<RegExpExecArray>;
        static generate<T>(factory: (index?: number) => T, count?: number): Enumerable<T>;
        static unfold<T>(seed: T, valueFactory: Selector<T, T>, skipSeed?: Boolean): Enumerable<T>;
        static defer<T>(enumerableFactory: () => System.Collections.IEnumerable<T>): Enumerable<T>;
        static forEach<T>(enumerable: IEnumerable<T>, action: (element: T, index?: number) => any): void;
        static max(values: Enumerable<number>): number;
        static min(values: Enumerable<number>): number;
        assertIsNotDisposed(errorMessage?: string): boolean;
        forEach(action: Predicate<T>): void;
        forEach(action: Action<T>): void;
        toArray(predicate?: Predicate<T>): T[];
        asEnumerable(): Enumerable<T>;
        toLookup<TKey, TValue, TCompare>(keySelector: Selector<T, TKey>, elementSelector?: Selector<T, TValue>, compareSelector?: Selector<TKey, TCompare>): Lookup<TKey, TValue>;
        toMap<TResult>(keySelector: Selector<T, string>, elementSelector: Selector<T, TResult>): IMap<TResult>;
        toDictionary<TKey, TValue, TCompare>(keySelector: Selector<T, TKey>, elementSelector: Selector<T, TValue>, compareSelector?: Selector<TKey, TCompare>): Dictionary<TKey, TValue>;
        toJoinedString(separator?: string, selector?: Selector<T, string>): string;
        doAction(action: Selector<T, EnumerableAction>): Enumerable<T>;
        doAction(action: Selector<T, number>): Enumerable<T>;
        doAction(action: Predicate<T>): Enumerable<T>;
        doAction(action: Action<T>): Enumerable<T>;
        force(defaultAction?: EnumerableAction): void;
        skip(count: number): Enumerable<T>;
        skipWhile(predicate: Predicate<T>): Enumerable<T>;
        take(count: number): Enumerable<T>;
        takeWhile(predicate: Predicate<T>): Enumerable<T>;
        takeUntil(predicate: Predicate<T>, includeUntilValue?: boolean): Enumerable<T>;
        takeExceptLast(count?: number): Enumerable<T>;
        takeFromLast(count: number): Enumerable<T>;
        traverseBreadthFirst(func: (element: any) => IEnumerable<any>, resultSelector?: (element: any, nestLevel?: number) => any): Enumerable<any>;
        traverseDepthFirst(func: (element: any) => System.Collections.IEnumerable<any>, resultSelector?: (element: any, nestLevel?: number) => any): Enumerable<any>;
        flatten(): Enumerable<any>;
        pairwise<TSelect>(selector: (prev: T, current: T) => TSelect): Enumerable<TSelect>;
        scan(func: (a: T, b: T) => T, seed?: T): Enumerable<T>;
        select<TResult>(selector: Selector<T, TResult>): Enumerable<TResult>;
        selectMany<TResult>(collectionSelector: Selector<T, IEnumerable<TResult>>): Enumerable<TResult>;
        selectMany<TResult>(collectionSelector: Selector<T, TResult[]>): Enumerable<TResult>;
        selectMany<TElement, TResult>(collectionSelector: Selector<T, IEnumerable<TElement>>, resultSelector?: (collection: T, element: TElement) => TResult): Enumerable<TResult>;
        selectMany<TElement, TResult>(collectionSelector: Selector<T, TElement[]>, resultSelector?: (collection: T, element: TElement) => TResult): Enumerable<TResult>;
        choose<TResult>(selector: Selector<T, TResult>): Enumerable<TResult>;
        where(predicate: Predicate<T>): Enumerable<T>;
        ofType<TType>(type: {
            new (): TType;
        }): Enumerable<TType>;
        except<TCompare>(second: IEnumerable<T>, compareSelector?: Selector<T, TCompare>): Enumerable<T>;
        distinct(compareSelector?: (value: T) => T): Enumerable<T>;
        distinctUntilChanged<TCompare>(compareSelector?: Selector<T, TCompare>): Enumerable<T>;
        reverse(): Enumerable<T>;
        shuffle(): Enumerable<T>;
        count(predicate?: Predicate<T>): number;
        all(predicate: Predicate<T>): boolean;
        every(predicate: Predicate<T>): boolean;
        any(predicate?: Predicate<T>): boolean;
        some(predicate: Predicate<T>): boolean;
        isEmpty(): boolean;
        contains<TCompare>(value: T, compareSelector?: Selector<T, TCompare>): boolean;
        indexOf<TCompare>(value: T, compareSelector?: Selector<T, TCompare>): number;
        lastIndexOf<TCompare>(value: T, compareSelector?: Selector<T, TCompare>): number;
        defaultIfEmpty(defaultValue?: T): Enumerable<T>;
        zip<TSecond, TResult>(second: Enumerable<TSecond>, resultSelector: (first: T, second: TSecond, index?: number) => TResult): Enumerable<TResult>;
        zip<TSecond, TResult>(second: System.Collections.IArray<TSecond>, resultSelector: (first: T, second: TSecond, index?: number) => TResult): Enumerable<TResult>;
        zipMultiple<TSecond, TResult>(second: Enumerable<TSecond>[], resultSelector: (first: T, second: TSecond, index?: number) => TResult): Enumerable<TResult>;
        zipMultiple<TSecond, TResult>(second: System.Collections.IArray<TSecond>[], resultSelector: (first: T, second: TSecond, index?: number) => TResult): Enumerable<TResult>;
        join<TInner, TKey, TResult, TCompare>(inner: Enumerable<TInner>, outerKeySelector: Selector<T, TKey>, innerKeySelector: Selector<TInner, TKey>, resultSelector: (outer: T, inner: TInner) => TResult, compareSelector?: Selector<TKey, TCompare>): Enumerable<TResult>;
        groupJoin<TInner, TKey, TResult, TCompare>(inner: Enumerable<TInner>, outerKeySelector: Selector<T, TKey>, innerKeySelector: Selector<TInner, TKey>, resultSelector: (outer: T, inner: TInner[]) => TResult, compareSelector?: Selector<TKey, TCompare>): Enumerable<TResult>;
        concatWith(other: System.Collections.IEnumerable<T>): Enumerable<T>;
        concatWith(other: System.Collections.IArray<T>): Enumerable<T>;
        merge(enumerables: System.Collections.IEnumerable<T>[]): Enumerable<T>;
        merge(enumerables: System.Collections.IArray<T>[]): Enumerable<T>;
        concat(...enumerables: System.Collections.IEnumerable<T>[]): Enumerable<T>;
        concat(...enumerables: System.Collections.IArray<T>[]): Enumerable<T>;
        insertAt(index: number, other: System.Collections.IEnumerable<T>): Enumerable<T>;
        insertAt(index: number, other: System.Collections.IArray<T>): Enumerable<T>;
        alternateMultiple(sequence: System.Collections.IEnumerable<T>): Enumerable<T>;
        alternateMultiple(sequence: System.Collections.IArray<T>): Enumerable<T>;
        alternateSingle(value: T): Enumerable<T>;
        alternate(...sequence: T[]): Enumerable<T>;
        intersect<TCompare>(second: System.Collections.IEnumerable<T>, compareSelector?: Selector<T, TCompare>): Enumerable<T>;
        intersect<TCompare>(second: System.Collections.IArray<T>, compareSelector?: Selector<T, TCompare>): Enumerable<T>;
        sequenceEqual(second: System.Collections.IEnumerable<T>, equalityComparer?: (a: T, b: T) => boolean): boolean;
        sequenceEqual(second: System.Collections.IArray<T>, equalityComparer?: (a: T, b: T) => boolean): boolean;
        union<TCompare>(second: System.Collections.IEnumerable<T>, compareSelector: Selector<T, TCompare>): Enumerable<T>;
        union<TCompare>(second: System.Collections.IArray<T>, compareSelector?: Selector<T, TCompare>): Enumerable<T>;
        orderBy<TKey>(keySelector?: Selector<T, TKey>): OrderedEnumerable<T>;
        orderByDescending<TKey>(keySelector?: Selector<T, TKey>): OrderedEnumerable<T>;
        groupBy<TKey, TElement, TCompare>(keySelector: Selector<T, TKey>, elementSelector?: Selector<T, TElement>, compareSelector?: Selector<TKey, TCompare>): Enumerable<Grouping<TKey, TElement>>;
        partitionBy<TKey, TElement, TCompare>(keySelector: Selector<T, TKey>, elementSelector?: Selector<T, TElement>, resultSelector?: (key: TKey, element: TElement[]) => IGrouping<TKey, TElement>, compareSelector?: Selector<TKey, TCompare>): Enumerable<IGrouping<TKey, TElement>>;
        buffer(size: number): System.Collections.IEnumerable<T[]>;
        aggregate(func: (a: T, b: T) => T, seed?: T): T;
        average(selector?: Selector<T, number>): number;
        max(): T;
        min(): T;
        maxBy<TCompare>(keySelector?: Selector<T, TCompare>): T;
        minBy<TCompare>(keySelector?: Selector<T, TCompare>): T;
        sum(selector?: Selector<T, number>): number;
        product(selector?: Selector<T, number>): number;
        elementAt(index: number): T;
        elementAtOrDefault(index: number, defaultValue?: T): T;
        first(): T;
        firstOrDefault(defaultValue?: T): T;
        last(): T;
        lastOrDefault(defaultValue?: T): T;
        single(): T;
        singleOrDefault(defaultValue?: T): T;
        share(): Enumerable<T>;
        memoize(): Enumerable<T>;
        catchError(handler: (e: Error) => void): Enumerable<T>;
        finallyAction(action: () => void): Enumerable<T>;
    }
    class ArrayEnumerable<T> extends Enumerable<T> {
        private _source;
        constructor(source: System.Collections.IArray<T>);
        protected _onDispose(): void;
        source: System.Collections.IArray<T>;
        toArray(): T[];
        asEnumerable(): ArrayEnumerable<T>;
        forEach(action: (element: T, index?: number) => boolean): void;
        forEach(action: (element: T, index?: number) => void): void;
        any(predicate?: Predicate<T>): boolean;
        count(predicate?: Predicate<T>): number;
        elementAt(index: number): T;
        elementAtOrDefault(index: number, defaultValue?: T): T;
        first(): T;
        firstOrDefault(defaultValue?: T): T;
        last(): T;
        lastOrDefault(defaultValue?: T): T;
        skip(count: number): Enumerable<T>;
        takeExceptLast(count?: number): Enumerable<T>;
        takeFromLast(count: number): Enumerable<T>;
        reverse(): Enumerable<T>;
        memoize(): ArrayEnumerable<T>;
        sequenceEqual(second: System.Collections.IEnumerable<T>, equalityComparer?: (a: T, b: T) => boolean): boolean;
        sequenceEqual(second: System.Collections.IArray<T>, equalityComparer?: (a: T, b: T) => boolean): boolean;
        toJoinedString(separator?: string, selector?: Selector<T, string>): string;
    }
    class WhereEnumerable<T> extends Enumerable<T> {
        private prevSource;
        private prevPredicate;
        constructor(prevSource: System.Collections.IEnumerable<T>, prevPredicate: Predicate<T>);
        where(predicate: Predicate<T>): Enumerable<T>;
        select<TSelect>(selector: Selector<T, TSelect>): Enumerable<TSelect>;
        getEnumerator(): System.Collections.IEnumerator<T>;
        protected _onDispose(): void;
    }
    class WhereSelectEnumerable<TSource, T> extends Enumerable<T> {
        private prevSource;
        private prevPredicate;
        private prevSelector;
        constructor(prevSource: System.Collections.IEnumerable<TSource>, prevPredicate: Predicate<TSource>, prevSelector: Selector<TSource, T>);
        where(predicate: (value: T, index?: number) => boolean): Enumerable<T>;
        select<TSelect>(selector: Selector<T, TSelect>): Enumerable<TSelect>;
        getEnumerator(): System.Collections.IEnumerator<T>;
        protected _onDispose(): void;
    }
    class OrderedEnumerable<T> extends Enumerable<T> {
        private source;
        keySelector: (value: T) => any;
        descending: boolean;
        parent: OrderedEnumerable<T>;
        constructor(source: System.Collections.IEnumerable<T>, keySelector: (value: T) => any, descending: boolean, parent?: OrderedEnumerable<T>);
        createOrderedEnumerable(keySelector: (value: T) => any, descending: boolean): OrderedEnumerable<T>;
        thenBy(keySelector: (value: T) => any): OrderedEnumerable<T>;
        thenByDescending(keySelector: (value: T) => any): OrderedEnumerable<T>;
        getEnumerator(): System.Collections.EnumeratorBase<T>;
        protected _onDispose(): void;
    }
    interface ILookup<TKey, TElement> extends IEnumerable<IGrouping<TKey, TElement>> {
        count: number;
        get(key: TKey): TElement[];
        contains(key: TKey): boolean;
    }
    class Lookup<TKey, TElement> implements ILookup<TKey, TElement> {
        private _dictionary;
        constructor(_dictionary: System.Collections.Dictionary<TKey, TElement[]>);
        count: number;
        get(key: TKey): TElement[];
        contains(key: TKey): boolean;
        getEnumerator(): System.Collections.IEnumerator<Grouping<TKey, TElement>>;
    }
    interface IGrouping<TKey, TElement> extends IEnumerable<TElement> {
        key: TKey;
    }
    class Grouping<TKey, TElement> extends ArrayEnumerable<TElement> implements IGrouping<TKey, TElement> {
        private _groupKey;
        constructor(_groupKey: TKey, elements: TElement[]);
        key: TKey;
    }
}
