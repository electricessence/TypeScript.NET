declare module System {
    class Functions {
        public Identity<T>(x: T): T;
        public True(): boolean;
        public False(): boolean;
        public Blank(): void;
        static Identity : <T>(x: T) => T;
        static True : () => boolean;
        static False : () => boolean;
        static Blank : () => void;
    }
}
declare module System {
    class Types {
        public Boolean: string;
        public Number: string;
        public String: string;
        public Object: string;
        public Null: string;
        public Undefined: string;
        public Function: string;
        static Boolean : string;
        static Number : string;
        static String : string;
        static Object : string;
        static Null : string;
        static Undefined : string;
        static Function : string;
        public isBoolean(type: any): boolean;
        static isBoolean(type: any): boolean;
        public isNumber(type: any): boolean;
        static isNumber(type: any): boolean;
        public isString(type: any): boolean;
        static isString(type: any): boolean;
        public isFunction(type: any): boolean;
        static isFunction(type: any): boolean;
    }
}
declare module System {
    interface Action<T> {
        (object: T, index?: number): void;
    }
    interface Predicate<T> {
        (object: T, index?: number): boolean;
    }
    interface Comparison<T> {
        (a: T, b: T): number;
    }
    interface Selector<TSource, TResult> {
        (source: TSource, index?: number): TResult;
    }
    function isEqualToNaN(n: any): boolean;
    function areEqual(a: any, b: any, strict?: boolean): boolean;
    function compare(a: any, b: any, strict?: boolean): number;
    function clone(source: any, depth?: number): any;
    function copyTo(source: any, target: any): void;
    function applyMixins(derivedCtor: any, baseCtors: any[]): void;
}
declare module System {
    function dispose(obj: any): void;
    function using<TDisposable, TReturn>(disposable: TDisposable, closure: (disposable: TDisposable) => TReturn): TReturn;
    interface IDisposable {
        dispose(): void;
        wasDisposed: boolean;
    }
    class DisposableBase implements IDisposable {
        private _finalizer;
        constructor(_finalizer?: () => void);
        public _wasDisposed: boolean;
        public wasDisposed : boolean;
        static assertIsNotDisposed(disposed: boolean, errorMessage?: string): boolean;
        public assertIsNotDisposed(errorMessage?: string): boolean;
        public dispose(): void;
        public _onDispose(): void;
    }
}
declare module ObjectX.Core {
    interface ICloneable<T> {
        clone(): T;
    }
}
declare module System {
    interface IEquatable {
        equals(other: any): boolean;
    }
}
declare module System {
    interface ILazy<T> extends IDisposable {
        value: T;
        isValueCreated: boolean;
    }
    class Lazy<T> extends DisposableBase implements ILazy<T> {
        private _closure;
        private _isValueCreated;
        private _value;
        constructor(_closure: () => T);
        public isValueCreated : boolean;
        public reset(): void;
        public value : T;
        public valueOnce(): T;
        public _onDispose(): void;
    }
}
declare module System.Collections.ArrayUtility {
    function copy<T>(array: T[]): T[];
    function contains<T>(array: T[], item: T): boolean;
    function replace<T>(array: T[], old: T, newValue: T, max?: number): number;
    function register<T>(array: T[], item: T): boolean;
    function findIndex<T>(array: T[], predicate: (item: T) => boolean): number;
    function areAllEqual(arrays: any[][], strict?: boolean): boolean;
    function areEqual<T>(a: T[], b: T[], strict?: boolean, equalityComparer?: (a: T, b: T, strict?: boolean) => boolean): boolean;
    function applyTo(target: number[], fn: (a: number) => number): number[];
    function removeIndex<T>(array: T[], index: number): boolean;
    function remove<T>(array: T[], value: T, max?: number): number;
    function repeat<T>(element: T, count: number): T[];
    function sum(source: number[], ignoreNaN?: boolean): number;
    function average(source: number[], ignoreNaN?: boolean): number;
    function product(source: number[], ignoreNaN?: boolean): number;
    function min(source: number[], ignoreNaN?: boolean): number;
    function max(source: number[], ignoreNaN?: boolean): number;
}
declare module System {
    interface IEventDispatcher extends EventTarget, IDisposable {
        addEventListener(type: string, listener: EventListener, useCapture?: boolean, priority?: number): void;
        dispatchEvent(event: Event): boolean;
        hasEventListener(type: string): boolean;
        removeEventListener(type: string, listener: EventListener, useCapture?: boolean): void;
    }
    class EventDispatcher extends DisposableBase implements IEventDispatcher {
        private _listeners;
        public addEventListener(type: string, listener: EventListener, useCapture?: boolean, priority?: number): void;
        public registerEventListener(type: string, listener: EventListener, useCapture?: boolean, priority?: number): void;
        public hasEventListener(type: string, listener?: EventListener, useCapture?: boolean): boolean;
        public removeEventListener(type: string, listener: EventListener, userCapture?: boolean): void;
        public dispatchEvent(type: string, params?: any): boolean;
        public dispatchEvent(event: Event): boolean;
        static DISPOSING : string;
        static DISPOSED : string;
        public _isDisposing: boolean;
        public isDisposing : boolean;
        public dispose(): void;
    }
}
declare module System.Collections {
    interface IEnumerator<T> {
        current: T;
        moveNext(): boolean;
        reset(): void;
        dispose(): void;
    }
}
declare module System.Collections {
    interface IEnumerable<T> {
        getEnumerator(): IEnumerator<T>;
    }
}
declare module System.Collections {
    interface ICollection<T> extends IEnumerable<T> {
        count: number;
        isReadOnly: boolean;
        add(item: T): void;
        clear(): number;
        contains(item: T): boolean;
        copyTo(array: T[], index?: number): void;
        remove(item: T): number;
    }
}
declare module System.Collections {
    interface IList<T> extends ICollection<T> {
        get(index: number): T;
        set(index: number, value: T): boolean;
        indexOf(item: T): number;
        insert(index: number, value: T): void;
        removeAt(index: number): void;
    }
}
declare module System.Collections {
    interface IMap<TValue> {
        [key: string]: TValue;
    }
    interface IKeyValuePair<TKey, TValue> {
        key: TKey;
        value: TValue;
    }
    interface IStringKeyValuePair<TValue> extends IKeyValuePair<string, TValue> {
    }
    interface IDictionary<TKey, TValue> extends ICollection<IKeyValuePair<TKey, TValue>> {
        keys: TKey[];
        values: TValue[];
        addByKeyValue(key: TKey, value: TValue): void;
        get(key: TKey): TValue;
        set(key: TKey, value: TValue): boolean;
        containsKey(key: TKey): boolean;
        containsValue(value: TValue): boolean;
        removeByKey(key: TKey): boolean;
        removeByValue(value: TValue): number;
        importPairs(pairs: IKeyValuePair<TKey, TValue>[]): boolean;
    }
    interface IStringKeyDictionary<TValue> extends IDictionary<string, TValue>, ICollection<IStringKeyValuePair<TValue>> {
        importMap(map: IMap<TValue>): boolean;
    }
    interface IOrderedDictionary<TKey, TValue> extends IDictionary<TKey, TValue> {
        indexOfKey(key: TKey): number;
        getValueByIndex(index: number): TValue;
    }
}
declare module System.Collections {
    interface IYield<T> {
        current: T;
        yieldReturn(value: T): boolean;
        yieldBreak(): boolean;
    }
    module Enumerator {
        function from<T>(source: any): IEnumerator<T>;
    }
    class EnumeratorBase<T> extends DisposableBase implements IEnumerator<T> {
        private initializer;
        private tryGetNext;
        private disposer;
        private _yielder;
        private _state;
        public current : T;
        constructor(initializer: () => void, tryGetNext: (yielder: IYield<T>) => boolean, disposer?: () => void);
        public reset(): void;
        public moveNext(): boolean;
        public _onDispose(): void;
    }
    class IndexEnumerator<T> extends EnumeratorBase<T> {
        constructor(sourceFactory: () => {
            source: {
                [index: number]: T;
            };
            pointer: number;
            length: number;
            step: number;
        });
    }
    class ArrayEnumerator<T> extends IndexEnumerator<T> {
        constructor(arrayFactory: () => T[], start?: number, step?: number);
        constructor(array: T[], start?: number, step?: number);
    }
}
declare module System.Collections {
    class DictionaryAbstractBase<TKey, TValue> implements IDictionary<TKey, TValue> {
        private _updateRecursion;
        public isUpdating : boolean;
        public onValueChanged: (key: TKey, value: TValue, old: TValue) => void;
        public _onValueUpdate(key: TKey, value: TValue, old: TValue): void;
        public onUpdated: () => void;
        private _onUpdated();
        public handleUpdate(closure?: () => boolean): boolean;
        public isReadOnly : boolean;
        public count : number;
        public add(item: IKeyValuePair<TKey, TValue>): void;
        public clear(): number;
        public contains(item: IKeyValuePair<TKey, TValue>): boolean;
        public copyTo(array: IKeyValuePair<TKey, TValue>[], index?: number): void;
        public remove(item: IKeyValuePair<TKey, TValue>): number;
        public keys : TKey[];
        public values : TValue[];
        public addByKeyValue(key: TKey, value: TValue): void;
        public get(key: TKey): TValue;
        public set(key: TKey, value: TValue): boolean;
        public containsKey(key: TKey): boolean;
        public containsValue(value: TValue): boolean;
        public removeByKey(key: TKey): boolean;
        public removeByValue(value: TValue): number;
        public importPairs(pairs: IKeyValuePair<TKey, TValue>[]): boolean;
        public getEnumerator(): IEnumerator<IKeyValuePair<TKey, TValue>>;
    }
}
declare module System.Collections {
    class Dictionary<TKey, TValue> extends DictionaryAbstractBase<TKey, TValue> {
        private compareSelector;
        private _count;
        private _entries;
        private _buckets;
        constructor(compareSelector?: Selector<TKey, any>);
        private setKV(key, value, allowOverwrite);
        public addByKeyValue(key: TKey, value: TValue): void;
        public get(key: TKey): TValue;
        public set(key: TKey, value: TValue): boolean;
        public containsKey(key: TKey): boolean;
        public clear(): number;
        public count : number;
        public getEnumerator(): IEnumerator<IKeyValuePair<TKey, TValue>>;
        public keys : TKey[];
        public values : TValue[];
    }
}
declare module System.Collections {
    class StringKeyDictionary<TValue> extends DictionaryAbstractBase<string, TValue> implements IStringKeyDictionary<TValue> {
        private _count;
        private _map;
        public containsKey(key: string): boolean;
        public containsValue(value: TValue): boolean;
        public get(key: string): TValue;
        public set(key: string, value: TValue): boolean;
        public importMap(values: IMap<TValue>): boolean;
        public toMap(selector?: (key: string, value: TValue) => TValue): IMap<TValue>;
        public keys : string[];
        public values : TValue[];
        public count : number;
    }
}
declare module System.Collections {
    class OrderedStringKeyDictionary<TValue> extends StringKeyDictionary<TValue> implements IOrderedDictionary<string, TValue> {
        private _order;
        constructor();
        public indexOfKey(key: string): number;
        public getValueByIndex(index: number): TValue;
        public set(key: string, value: TValue, keepIndex?: boolean): boolean;
        public setByIndex(index: number, value: TValue): boolean;
        public importValues(values: TValue[]): boolean;
        public setValues(...values: TValue[]): boolean;
        public removeByIndex(index: number): boolean;
        public keys : string[];
    }
}
