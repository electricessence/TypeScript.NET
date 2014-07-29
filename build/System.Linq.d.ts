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
        static fromArray<T>(array: T[]): ArrayEnumerable<T>;
        public getEnumerator(): Collections.IEnumerator<T>;
        public _onDispose(): void;
        static choice<T>(values: T[]): Enumerable<T>;
        static cycle<T>(values: T[]): Enumerable<T>;
        static empty<T>(): Enumerable<T>;
        static repeat<T>(element: T, count?: number): Enumerable<T>;
        static repeatWithFinalize<T>(initializer: () => T, finalizer: (element: T) => void): Enumerable<T>;
        static make<T>(element: T): Enumerable<T>;
        static range(start: number, count: number, step?: number): Enumerable<number>;
        static rangeDown(start: number, count: number, step?: number): Enumerable<number>;
        static toInfinity(start?: number, step?: number): Enumerable<number>;
        static toNegativeInfinity(start?: number, step?: number): Enumerable<number>;
        static rangeTo(start: number, to: number, step?: number): Enumerable<number>;
        static matches(input: string, pattern: any, flags?: string): Enumerable<RegExpExecArray>;
        static generate<T>(factory: () => T, count?: number): Enumerable<T>;
        static unfold<T>(seed: T, valueFactory: (value: T) => T): Enumerable<T>;
        static defer<T>(enumerableFactory: () => Collections.IEnumerable<T>): Enumerable<T>;
        static forEach<T>(enumerable: Collections.IEnumerable<T>, action: (element: T, index?: number) => any): void;
        public assertIsNotDisposed(errorMessage?: string): boolean;
        public forEach(action: (element: T, index?: number) => boolean): void;
        public forEach(action: (element: T, index?: number) => void): void;
        public toArray(predicate?: (value: T, index?: number) => boolean): T[];
        public asEnumerable(): Enumerable<T>;
        public doAction(action: (element: T, index?: number) => EnumerableAction): Enumerable<T>;
        public doAction(action: (element: T, index?: number) => number): Enumerable<T>;
        public doAction(action: (element: T, index?: number) => boolean): Enumerable<T>;
        public doAction(action: (element: T, index?: number) => void): Enumerable<T>;
        public force(): void;
        public skip(count: number): Enumerable<T>;
        public skipWhile(predicate: (element: T, index?: number) => boolean): Enumerable<T>;
        public take(count: number): Enumerable<T>;
        public select<TResult>(selector: (value: T, index?: number) => TResult): Enumerable<TResult>;
        public selectMany<TResult>(collectionSelector: (element: T, index?: number) => Collections.IEnumerable<TResult>): Enumerable<TResult>;
        public selectMany<TResult>(collectionSelector: (element: T, index?: number) => TResult[]): Enumerable<TResult>;
        public selectMany<TElement, TResult>(collectionSelector: (collection: T, index?: number) => Collections.IEnumerable<TElement>, resultSelector?: (collection: T, element: TElement) => TResult): Enumerable<TResult>;
        public selectMany<TElement, TResult>(collectionSelector: (collection: T, index?: number) => TElement[], resultSelector?: (collection: T, element: TElement) => TResult): Enumerable<TResult>;
        public choose<TResult>(selector: (value: T, index?: number) => TResult): Enumerable<TResult>;
        public where(predicate: (value: T, index?: number) => boolean): Enumerable<T>;
        public ofType<TType>(type: any): Enumerable<TType>;
        public except(second: Collections.IEnumerable<T>, compareSelector?: (value: T) => T): Enumerable<T>;
        public distinct(compareSelector?: (value: T) => T): Enumerable<T>;
        public distinctUntilChanged(compareSelector?: (value: T) => T): Enumerable<T>;
        public reverse(): Enumerable<T>;
        public shuffle(): Enumerable<T>;
        public count(predicate?: (value: T, index?: number) => boolean): number;
        public all(predicate: (value: T) => boolean): boolean;
        public any(predicate?: (value: T) => boolean): boolean;
        public isEmpty(): boolean;
        public contains(value: T, compareSelector?: (value: T) => T): boolean;
        public defaultIfEmpty(defaultValue?: T): Enumerable<T>;
        public elementAt(index: number): T;
        public elementAtOrDefault(index: number, defaultValue?: T): T;
        public first(predicate?: (value: T, index?: number) => boolean): T;
        public firstOrDefault(predicate: (value: T, index?: number) => boolean, defaultValue?: T): T;
        public last(predicate?: (value: T, index?: number) => boolean): T;
        public lastOrDefault(predicate: (value: T, index?: number) => boolean, defaultValue?: T): T;
        public single(predicate?: (value: T, index?: number) => boolean): T;
        public singleOrDefault(predicate: (value: T, index?: number) => boolean, defaultValue?: T): T;
        public share(): Enumerable<T>;
        public memoize(): Enumerable<T>;
        public catchError(handler: (e: Error) => void): Enumerable<T>;
        public finallyAction(action: () => void): Enumerable<T>;
    }
}
declare module System.Linq {
    class ArrayEnumerable<T> extends Enumerable<T> {
        private _source;
        constructor(source: T[]);
        public _onDispose(): void;
        public source : T[];
        public toArray(): T[];
        public asEnumerable(): ArrayEnumerable<T>;
        public forEach(action: (element: T, index?: number) => boolean): void;
        public forEach(action: (element: T, index?: number) => void): void;
        public any(predicate?: (value: T, index?: number) => boolean): boolean;
        public count(predicate?: (value: T, index?: number) => boolean): number;
        public elementAt(index: number): T;
        public elementAtOrDefault(index: number, defaultValue?: T): T;
        public first(predicate?: (value: T, index?: number) => boolean): T;
        public firstOrDefault(predicate: (value: T, index?: number) => boolean, defaultValue?: T): T;
        public last(predicate?: (value: T, index?: number) => boolean): T;
        public lastOrDefault(predicate: (value: T, index?: number) => boolean, defaultValue?: T): T;
        public skip(count: number): Enumerable<T>;
        public takeExceptLast(count?: number): Enumerable<T>;
        public takeFromLast(count: number): Enumerable<T>;
        public reverse(): Enumerable<T>;
        public memoize(): ArrayEnumerable<T>;
    }
}
declare module System.Linq {
    interface IGrouping<TKey, TElement> extends Collections.IEnumerable<TElement> {
        key: TKey;
    }
    class Grouping<TKey, TElement> extends ArrayEnumerable<TElement> implements IGrouping<TKey, TElement> {
        private _groupKey;
        constructor(_groupKey: TKey, elements: TElement[]);
        public key : TKey;
    }
}
declare module System.Linq {
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
}
declare module System.Linq {
    class WhereEnumerable<T> extends Enumerable<T> {
        private prevSource;
        private prevPredicate;
        constructor(prevSource: Collections.IEnumerable<T>, prevPredicate: (value: T, index?: number) => boolean);
        public where(predicate: (value: T, index?: number) => boolean): Enumerable<T>;
        public select<TResult>(selector: (value: T, index?: number) => TResult): Enumerable<TResult>;
        public getEnumerator(): Collections.IEnumerator<T>;
        public _onDispose(): void;
    }
}
declare module System.Linq {
    class WhereSelectEnumerable<T, TSelect> extends Enumerable<TSelect> {
        private prevSource;
        private prevPredicate;
        private prevSelector;
        constructor(prevSource: Collections.IEnumerable<T>, prevPredicate: (value: T, index?: number) => boolean, prevSelector: (value: T, index?: number) => TSelect);
        public where(predicate: (value: TSelect, index?: number) => boolean): Enumerable<TSelect>;
        public select<TResult>(selector: (value: TSelect, index?: number) => TResult): Enumerable<TResult>;
        public getEnumerator(): Collections.IEnumerator<TSelect>;
        public _onDispose(): void;
    }
}
declare module System.Linq {
    class OrderedEnumerable<T> extends Enumerable<T> {
        private source;
        public keySelector: (value: T) => any;
        public descending: boolean;
        public parent: OrderedEnumerable<T>;
        constructor(source: Collections.IEnumerable<T>, keySelector: (value: T) => any, descending: boolean, parent: OrderedEnumerable<T>);
        public createOrderedEnumerable(keySelector: (value: T) => any, descending: boolean): OrderedEnumerable<T>;
        public thenBy(keySelector: (value: T) => any): OrderedEnumerable<T>;
        public thenByDescending(keySelector: (value: T) => any): OrderedEnumerable<T>;
        public getEnumerator(): Collections.EnumeratorBase<T>;
        public _onDispose(): void;
    }
}
