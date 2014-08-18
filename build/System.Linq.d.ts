/// <reference path="System.d.ts" />
declare module System.Linq {
    enum EnumerableAction {
        Break = 0,
        Return = 1,
        Skip = 2,
    }
    class Enumerable<T> extends DisposableBase implements Collections.IEnumerable<T> {
        private enumeratorFactory;
        constructor(enumeratorFactory: () => Collections.IEnumerator<T>, finalizer?: () => void);
        static fromArray<T>(array: Collections.IArray<T>): ArrayEnumerable<T>;
        static from<T>(source: any): Enumerable<T>;
        public getEnumerator(): Collections.IEnumerator<T>;
        public _onDispose(): void;
        static choice<T>(values: Collections.IArray<T>): Enumerable<T>;
        static cycle<T>(values: Collections.IArray<T>): Enumerable<T>;
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
        static defer<T>(enumerableFactory: () => Collections.IEnumerable<T>): Enumerable<T>;
        static forEach<T>(enumerable: Collections.IEnumerable<T>, action: (element: T, index?: number) => any): void;
        static max(values: Enumerable<number>): number;
        static min(values: Enumerable<number>): number;
        public assertIsNotDisposed(errorMessage?: string): boolean;
        public forEach(action: Predicate<T>): void;
        public forEach(action: Action<T>): void;
        public toArray(predicate?: Predicate<T>): T[];
        public asEnumerable(): Enumerable<T>;
        public toLookup<TKey, TValue, TCompare>(keySelector: Selector<T, TKey>, elementSelector?: Selector<T, TValue>, compareSelector?: Selector<TKey, TCompare>): Lookup<TKey, TValue>;
        public toMap<TResult>(keySelector: Selector<T, string>, elementSelector: Selector<T, TResult>): Collections.IMap<TResult>;
        public toDictionary<TKey, TValue, TCompare>(keySelector: Selector<T, TKey>, elementSelector: Selector<T, TValue>, compareSelector?: Selector<TKey, TCompare>): Collections.Dictionary<TKey, TValue>;
        public toJoinedString(separator?: string, selector?: Selector<T, string>): string;
        public doAction(action: Selector<T, EnumerableAction>): Enumerable<T>;
        public doAction(action: Selector<T, number>): Enumerable<T>;
        public doAction(action: Predicate<T>): Enumerable<T>;
        public doAction(action: Action<T>): Enumerable<T>;
        public force(defaultAction?: EnumerableAction): void;
        public skip(count: number): Enumerable<T>;
        public skipWhile(predicate: Predicate<T>): Enumerable<T>;
        public take(count: number): Enumerable<T>;
        public takeWhile(predicate: Predicate<T>): Enumerable<T>;
        public takeUntil(predicate: Predicate<T>, includeUntilValue?: boolean): Enumerable<T>;
        public takeExceptLast(count?: number): Enumerable<T>;
        public takeFromLast(count: number): Enumerable<T>;
        public traverseBreadthFirst(func: (element: any) => Collections.IEnumerable<any>, resultSelector?: (element: any, nestLevel?: number) => any): Enumerable<any>;
        public traverseDepthFirst(func: (element: any) => Collections.IEnumerable<any>, resultSelector?: (element: any, nestLevel?: number) => any): Enumerable<any>;
        public flatten(): Enumerable<any>;
        public pairwise<TSelect>(selector: (prev: T, current: T) => TSelect): Enumerable<TSelect>;
        public scan(func: (a: T, b: T) => T, seed?: T): Enumerable<T>;
        public select<TResult>(selector: Selector<T, TResult>): Enumerable<TResult>;
        public selectMany<TResult>(collectionSelector: Selector<T, Collections.IEnumerable<TResult>>): Enumerable<TResult>;
        public selectMany<TResult>(collectionSelector: Selector<T, TResult[]>): Enumerable<TResult>;
        public selectMany<TElement, TResult>(collectionSelector: Selector<T, Collections.IEnumerable<TElement>>, resultSelector?: (collection: T, element: TElement) => TResult): Enumerable<TResult>;
        public selectMany<TElement, TResult>(collectionSelector: Selector<T, TElement[]>, resultSelector?: (collection: T, element: TElement) => TResult): Enumerable<TResult>;
        public choose<TResult>(selector: Selector<T, TResult>): Enumerable<TResult>;
        public where(predicate: Predicate<T>): Enumerable<T>;
        public ofType<TType>(type: new() => TType): Enumerable<TType>;
        public except<TCompare>(second: Collections.IEnumerable<T>, compareSelector?: Selector<T, TCompare>): Enumerable<T>;
        public distinct(compareSelector?: (value: T) => T): Enumerable<T>;
        public distinctUntilChanged<TCompare>(compareSelector?: Selector<T, TCompare>): Enumerable<T>;
        public reverse(): Enumerable<T>;
        public shuffle(): Enumerable<T>;
        public count(predicate?: Predicate<T>): number;
        public all(predicate: Predicate<T>): boolean;
        public every(predicate: Predicate<T>): boolean;
        public any(predicate?: Predicate<T>): boolean;
        public some(predicate: Predicate<T>): boolean;
        public isEmpty(): boolean;
        public contains<TCompare>(value: T, compareSelector?: Selector<T, TCompare>): boolean;
        public indexOf<TCompare>(value: T, compareSelector?: Selector<T, TCompare>): number;
        public lastIndexOf<TCompare>(value: T, compareSelector?: Selector<T, TCompare>): number;
        public defaultIfEmpty(defaultValue?: T): Enumerable<T>;
        public zip<TSecond, TResult>(second: Enumerable<TSecond>, resultSelector: (first: T, second: TSecond, index?: number) => TResult): Enumerable<TResult>;
        public zip<TSecond, TResult>(second: Collections.IArray<TSecond>, resultSelector: (first: T, second: TSecond, index?: number) => TResult): Enumerable<TResult>;
        public zipMultiple<TSecond, TResult>(second: Enumerable<TSecond>[], resultSelector: (first: T, second: TSecond, index?: number) => TResult): Enumerable<TResult>;
        public zipMultiple<TSecond, TResult>(second: Collections.IArray<TSecond>[], resultSelector: (first: T, second: TSecond, index?: number) => TResult): Enumerable<TResult>;
        public concatWith(other: Collections.IEnumerable<T>): Enumerable<T>;
        public concatWith(other: Collections.IArray<T>): Enumerable<T>;
        public merge(enumerables: Collections.IEnumerable<T>[]): Enumerable<T>;
        public merge(enumerables: Collections.IArray<T>[]): Enumerable<T>;
        public concat(...enumerables: Collections.IEnumerable<T>[]): Enumerable<T>;
        public concat(...enumerables: Collections.IArray<T>[]): Enumerable<T>;
        public insertAt(index: number, other: Collections.IEnumerable<T>): Enumerable<T>;
        public insertAt(index: number, other: Collections.IArray<T>): Enumerable<T>;
        public alternateMultiple(sequence: Collections.IEnumerable<T>): Enumerable<T>;
        public alternateMultiple(sequence: Collections.IArray<T>): Enumerable<T>;
        public alternateSingle(value: T): Enumerable<T>;
        public alternate(...sequence: T[]): Enumerable<T>;
        public intersect<TCompare>(second: Collections.IEnumerable<T>, compareSelector?: Selector<T, TCompare>): Enumerable<T>;
        public intersect<TCompare>(second: Collections.IArray<T>, compareSelector?: Selector<T, TCompare>): Enumerable<T>;
        public sequenceEqual(second: Collections.IEnumerable<T>, equalityComparer?: (a: T, b: T) => boolean): boolean;
        public sequenceEqual(second: Collections.IArray<T>, equalityComparer?: (a: T, b: T) => boolean): boolean;
        public union<TCompare>(second: Collections.IEnumerable<T>, compareSelector: Selector<T, TCompare>): Enumerable<T>;
        public union<TCompare>(second: Collections.IArray<T>, compareSelector?: Selector<T, TCompare>): Enumerable<T>;
        public orderBy<TKey>(keySelector?: Selector<T, TKey>): OrderedEnumerable<T>;
        public orderByDescending<TKey>(keySelector?: Selector<T, TKey>): OrderedEnumerable<T>;
        public groupBy<TKey, TElement, TCompare>(keySelector: Selector<T, TKey>, elementSelector?: Selector<T, TElement>, compareSelector?: Selector<TKey, TCompare>): Enumerable<IGrouping<TKey, TElement>>;
        public partitionBy<TKey, TElement, TCompare>(keySelector: Selector<T, TKey>, elementSelector?: Selector<T, TElement>, resultSelector?: (key: TKey, element: TElement[]) => IGrouping<TKey, TElement>, compareSelector?: Selector<TKey, TCompare>): Enumerable<IGrouping<TKey, TElement>>;
        public buffer(size: number): Collections.IEnumerable<T[]>;
        public aggregate(func: (a: T, b: T) => T, seed?: T): T;
        public average(selector?: Selector<T, number>): number;
        public max(): T;
        public min(): T;
        public maxBy<TCompare>(keySelector?: Selector<T, TCompare>): T;
        public minBy<TCompare>(keySelector?: Selector<T, TCompare>): T;
        public sum(selector?: Selector<T, number>): number;
        public product(selector?: Selector<T, number>): number;
        public elementAt(index: number): T;
        public elementAtOrDefault(index: number, defaultValue?: T): T;
        public first(): T;
        public firstOrDefault(defaultValue?: T): T;
        public last(): T;
        public lastOrDefault(defaultValue?: T): T;
        public single(): T;
        public singleOrDefault(defaultValue?: T): T;
        public share(): Enumerable<T>;
        public memoize(): Enumerable<T>;
        public catchError(handler: (e: Error) => void): Enumerable<T>;
        public finallyAction(action: () => void): Enumerable<T>;
    }
    class ArrayEnumerable<T> extends Enumerable<T> {
        private _source;
        constructor(source: Collections.IArray<T>);
        public _onDispose(): void;
        public source : Collections.IArray<T>;
        public toArray(): T[];
        public asEnumerable(): ArrayEnumerable<T>;
        public forEach(action: (element: T, index?: number) => boolean): void;
        public forEach(action: (element: T, index?: number) => void): void;
        public any(predicate?: Predicate<T>): boolean;
        public count(predicate?: Predicate<T>): number;
        public elementAt(index: number): T;
        public elementAtOrDefault(index: number, defaultValue?: T): T;
        public first(): T;
        public firstOrDefault(defaultValue?: T): T;
        public last(): T;
        public lastOrDefault(defaultValue?: T): T;
        public skip(count: number): Enumerable<T>;
        public takeExceptLast(count?: number): Enumerable<T>;
        public takeFromLast(count: number): Enumerable<T>;
        public reverse(): Enumerable<T>;
        public memoize(): ArrayEnumerable<T>;
        public sequenceEqual(second: Collections.IEnumerable<T>, equalityComparer?: (a: T, b: T) => boolean): boolean;
        public sequenceEqual(second: Collections.IArray<T>, equalityComparer?: (a: T, b: T) => boolean): boolean;
        public toJoinedString(separator?: string, selector?: Selector<T, string>): string;
    }
    class WhereEnumerable<T> extends Enumerable<T> {
        private prevSource;
        private prevPredicate;
        constructor(prevSource: Collections.IEnumerable<T>, prevPredicate: Predicate<T>);
        public where(predicate: Predicate<T>): Enumerable<T>;
        public select<TSelect>(selector: Selector<T, TSelect>): Enumerable<TSelect>;
        public getEnumerator(): Collections.IEnumerator<T>;
        public _onDispose(): void;
    }
    class WhereSelectEnumerable<TSource, T> extends Enumerable<T> {
        private prevSource;
        private prevPredicate;
        private prevSelector;
        constructor(prevSource: Collections.IEnumerable<TSource>, prevPredicate: Predicate<TSource>, prevSelector: Selector<TSource, T>);
        public where(predicate: (value: T, index?: number) => boolean): Enumerable<T>;
        public select<TSelect>(selector: Selector<T, TSelect>): Enumerable<TSelect>;
        public getEnumerator(): Collections.IEnumerator<T>;
        public _onDispose(): void;
    }
    class OrderedEnumerable<T> extends Enumerable<T> {
        private source;
        public keySelector: (value: T) => any;
        public descending: boolean;
        public parent: OrderedEnumerable<T>;
        constructor(source: Collections.IEnumerable<T>, keySelector: (value: T) => any, descending: boolean, parent?: OrderedEnumerable<T>);
        public createOrderedEnumerable(keySelector: (value: T) => any, descending: boolean): OrderedEnumerable<T>;
        public thenBy(keySelector: (value: T) => any): OrderedEnumerable<T>;
        public thenByDescending(keySelector: (value: T) => any): OrderedEnumerable<T>;
        public getEnumerator(): Collections.EnumeratorBase<T>;
        public _onDispose(): void;
    }
    interface ILookup<TKey, TElement> extends Collections.IEnumerable<IGrouping<TKey, TElement>> {
        count: number;
        get(key: TKey): TElement[];
        contains(key: TKey): boolean;
    }
    class Lookup<TKey, TElement> implements ILookup<TKey, TElement> {
        private _dictionary;
        constructor(_dictionary: Collections.Dictionary<TKey, TElement[]>);
        public count : number;
        public get(key: TKey): TElement[];
        public contains(key: TKey): boolean;
        public getEnumerator(): Collections.IEnumerator<Grouping<TKey, TElement>>;
    }
    interface IGrouping<TKey, TElement> extends Collections.IEnumerable<TElement> {
        key: TKey;
    }
    class Grouping<TKey, TElement> extends ArrayEnumerable<TElement> implements IGrouping<TKey, TElement> {
        private _groupKey;
        constructor(_groupKey: TKey, elements: TElement[]);
        public key : TKey;
    }
}
