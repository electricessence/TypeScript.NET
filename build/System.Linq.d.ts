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
        static generate<T>(factory: () => T, count?: number): Enumerable<T>;
        static unfold<T>(seed: T, valueFactory: (value: T) => T): Enumerable<T>;
        static defer<T>(enumerableFactory: () => Collections.IEnumerable<T>): Enumerable<T>;
        private assertIsNotDisposed();
        static forEach<T>(enumerable: Collections.IEnumerable<T>, action: (element: T, index?: number) => any): void;
        public forEach(action: (element: T, index?: number) => boolean): void;
        public forEach(action: (element: T, index?: number) => void): void;
        public toArray(predicate?: (value: T, index?: number) => boolean): T[];
        public doAction(action: (element: T, index?: number) => EnumerableAction): Enumerable<T>;
        public doAction(action: (element: T, index?: number) => number): Enumerable<T>;
        public doAction(action: (element: T, index?: number) => boolean): Enumerable<T>;
        public doAction(action: (element: T, index?: number) => void): Enumerable<T>;
        public force(): void;
        public skip(count: number): Enumerable<T>;
        public skipWhile(predicate: (element: T, index?: number) => boolean): Enumerable<T>;
        public take(count: number): Enumerable<T>;
        public select<TResult>(selector: (value: T, index?: number) => TResult): Enumerable<TResult>;
        public choose<TResult>(selector: (value: T, index?: number) => TResult): Enumerable<TResult>;
        public where(predicate: (value: T, index?: number) => boolean): Enumerable<T>;
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
