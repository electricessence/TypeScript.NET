declare module System {
    class Functions {
        Identity<T>(x: T): T;
        True(): boolean;
        False(): boolean;
        Blank(): void;
        static Identity: <T>(x: T) => T;
        static True: () => boolean;
        static False: () => boolean;
        static Blank: () => void;
    }
}
declare module System {
    module Types {
        var Boolean: string;
        var Number: string;
        var String: string;
        var Object: string;
        var Null: string;
        var Undefined: string;
        var Function: string;
        function isBoolean(type: any): boolean;
        function isNumber(type: any): boolean;
        function isString(type: any): boolean;
        function isFunction(type: any): boolean;
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
    interface Func<TResult> {
        (): TResult;
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
    function dispose(...disposables: IDisposable[]): void;
    function disposeWithoutException(...disposables: IDisposable[]): void;
    function disposeThese(disposables: IDisposable[], ignoreExceptions?: boolean): void;
    function using<TDisposable extends IDisposable, TReturn>(disposable: TDisposable, closure: (disposable: TDisposable) => TReturn): TReturn;
    interface IDisposable {
        dispose(): void;
    }
    interface IDisposableAware extends IDisposable {
        wasDisposed: boolean;
    }
    class DisposableBase implements IDisposableAware {
        private _finalizer;
        constructor(_finalizer?: () => void);
        _wasDisposed: boolean;
        wasDisposed: boolean;
        static assertIsNotDisposed(disposed: boolean, errorMessage?: string): boolean;
        assertIsNotDisposed(errorMessage?: string): boolean;
        dispose(): void;
        _onDispose(): void;
    }
}
declare module System.Collections.ArrayUtility {
    function initialize<T>(length: number): T[];
    function copy<T>(sourceArray: T[], sourceIndex?: number, length?: number): T[];
    function copyTo<T>(sourceArray: T[], destinationArray: T[], sourceIndex?: number, destinationIndex?: number, length?: number): void;
    function contains<T>(array: T[], item: T): boolean;
    function replace<T>(array: T[], old: T, newValue: T, max?: number): number;
    function updateRange<T>(array: T[], value: T, index: number, length: number): void;
    function clear(array: any[], index: number, length: number): void;
    function register<T>(array: T[], item: T): boolean;
    function findIndex<T>(array: IArray<T>, predicate: (item: T) => boolean): number;
    function areAllEqual(arrays: any[][], strict?: boolean): boolean;
    function areEqual<T>(a: IArray<T>, b: IArray<T>, strict?: boolean, equalityComparer?: (a: T, b: T, strict?: boolean) => boolean): boolean;
    function applyTo<T extends IArray<number>>(target: T, fn: (a: number) => number): T;
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
        addEventListener(type: string, listener: EventListener, useCapture?: boolean, priority?: number): void;
        registerEventListener(type: string, listener: EventListener, useCapture?: boolean, priority?: number): void;
        hasEventListener(type: string, listener?: EventListener, useCapture?: boolean): boolean;
        removeEventListener(type: string, listener: EventListener, userCapture?: boolean): void;
        dispatchEvent(type: string, params?: any): boolean;
        dispatchEvent(event: Event): boolean;
        static DISPOSING: string;
        static DISPOSED: string;
        _isDisposing: boolean;
        isDisposing: boolean;
        dispose(): void;
    }
}
declare module System {
    interface ICloneable<T> {
        clone(): T;
    }
}
declare module System {
    interface IComparable<T> {
        compareTo(other: T): number;
    }
}
declare module System {
    interface IConvertible {
        toBoolean(provider: IFormatProvider): boolean;
        toNumber(provider: IFormatProvider): number;
        toString(provider: IFormatProvider): string;
    }
}
declare module System {
    interface IEquatable<T> {
        equals(other: T): boolean;
    }
}
declare module System {
    interface IFormatProvider {
        getFormat(formatType: Object): Object;
    }
}
declare module System {
    interface IFormattable {
        toString(format?: string, formatProvider?: IFormatProvider): string;
    }
}
import DisposableBase = System.DisposableBase;
declare module System {
    interface ILazy<T> extends IDisposable, IEquatable<ILazy<T>> {
        value: T;
        isValueCreated: boolean;
    }
    class Lazy<T> extends DisposableBase implements ILazy<T> {
        private _closure;
        private _isValueCreated;
        private _value;
        constructor(_closure: Func<T>);
        isValueCreated: boolean;
        canReset: boolean;
        reset(throwIfCannotReset?: boolean): boolean;
        value: T;
        getValue(clearClosureReference?: boolean): T;
        _onDispose(): void;
        equals(other: Lazy<T>): boolean;
        valueEquals(other: Lazy<T>): boolean;
    }
}
declare module System {
    enum TimeUnit {
        Ticks = 0,
        Milliseconds = 1,
        Seconds = 2,
        Minutes = 3,
        Hours = 4,
        Days = 5,
    }
    interface ITimeMeasurement {
        ticks: number;
        milliseconds: number;
        seconds: number;
        minutes: number;
        hours: number;
        days: number;
    }
    class ClockTime implements ITimeMeasurement, IEquatable<ClockTime>, IComparable<ClockTime>, IFormattable {
        private _totalMilliseconds;
        totalMilliseconds: number;
        direction: number;
        constructor(milliseconds: number);
        constructor(hours: number, minutes: number, seconds?: number, milliseconds?: number);
        equals(other: ClockTime): boolean;
        compareTo(other: ClockTime): number;
        private _ticks;
        ticks: number;
        private _ms;
        milliseconds: number;
        private _seconds;
        seconds: number;
        private _minutes;
        minutes: number;
        private _hours;
        hours: number;
        private _days;
        days: number;
        toTimeSpan(): TimeSpan;
        static from(hours: number, minutes: number, seconds?: number, milliseconds?: number): ClockTime;
        toString(format?: string, formatProvider?: System.IFormatProvider): string;
    }
    class TimeUnitValue implements IEquatable<TimeUnitValue>, IComparable<TimeUnitValue> {
        value: number;
        private _type;
        constructor(value: number, _type: TimeUnit);
        coerce(other: TimeSpan): TimeUnitValue;
        coerce(other: TimeUnitValue): TimeUnitValue;
        equals(other: TimeSpan): boolean;
        equals(other: TimeUnitValue): boolean;
        compareTo(other: TimeSpan): number;
        compareTo(other: TimeUnitValue): number;
        type: TimeUnit;
        toTimeSpan(): TimeSpan;
        to(units?: TimeUnit): TimeUnitValue;
    }
    class TimeSpan implements ITimeMeasurement, IEquatable<TimeSpan>, IComparable<TimeSpan> {
        private _milliseconds;
        constructor(value: number, units?: TimeUnit);
        equals(other: TimeUnitValue): boolean;
        equals(other: TimeSpan): boolean;
        compareTo(other: TimeUnitValue): number;
        compareTo(other: TimeSpan): number;
        toTimeUnitValue(units?: TimeUnit): TimeUnitValue;
        static convertToMilliseconds(value: number, units?: TimeUnit): number;
        total(units: TimeUnit): number;
        ticks: number;
        milliseconds: number;
        seconds: number;
        minutes: number;
        hours: number;
        days: number;
        time: ClockTime;
        add(other: ClockTime): TimeSpan;
        add(other: TimeUnitValue): TimeSpan;
        add(other: TimeSpan): TimeSpan;
        addUnit(value: number, units?: TimeUnit): TimeSpan;
        static from(value: number, units: TimeUnit): TimeSpan;
        static fromDays(value: number): TimeSpan;
        static fromHours(value: number): TimeSpan;
        static fromMinutes(value: number): TimeSpan;
        static fromSeconds(value: number): TimeSpan;
        static fromMilliseconds(value: number): TimeSpan;
        static fromTicks(value: number): TimeSpan;
        static fromTime(hours: number, minutes: number, seconds?: number, milliseconds?: number): TimeSpan;
        static millisecondsFromTime(hours: number, minutes: number, seconds?: number, milliseconds?: number): number;
        static between(first: Date, last: Date): TimeSpan;
        static zero: TimeSpan;
    }
}
declare module System.Collections {
    class DictionaryAbstractBase<TKey, TValue> implements IDictionary<TKey, TValue> {
        private _updateRecursion;
        isUpdating: boolean;
        onValueChanged: (key: TKey, value: TValue, old: TValue) => void;
        _onValueUpdate(key: TKey, value: TValue, old: TValue): void;
        onUpdated: () => void;
        private _onUpdated();
        handleUpdate(closure?: () => boolean): boolean;
        isReadOnly: boolean;
        count: number;
        add(item: IKeyValuePair<TKey, TValue>): void;
        clear(): number;
        contains(item: IKeyValuePair<TKey, TValue>): boolean;
        copyTo(array: IKeyValuePair<TKey, TValue>[], index?: number): void;
        remove(item: IKeyValuePair<TKey, TValue>): number;
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
        getEnumerator(): IEnumerator<IKeyValuePair<TKey, TValue>>;
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
        addByKeyValue(key: TKey, value: TValue): void;
        get(key: TKey): TValue;
        set(key: TKey, value: TValue): boolean;
        containsKey(key: TKey): boolean;
        clear(): number;
        count: number;
        getEnumerator(): IEnumerator<IKeyValuePair<TKey, TValue>>;
        keys: TKey[];
        values: TValue[];
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
        function forEach<T>(e: IEnumerator<T>, action: (element: T, index?: number) => any): void;
    }
    class EnumeratorBase<T> extends DisposableBase implements IEnumerator<T> {
        private initializer;
        private tryGetNext;
        private disposer;
        private _yielder;
        private _state;
        current: T;
        constructor(initializer: () => void, tryGetNext: (yielder: IYield<T>) => boolean, disposer?: () => void);
        reset(): void;
        moveNext(): boolean;
        _onDispose(): void;
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
        constructor(arrayFactory: () => IArray<T>, start?: number, step?: number);
        constructor(array: IArray<T>, start?: number, step?: number);
    }
}
declare module System.Collections {
    interface IArray<T> {
        length: number;
        [index: number]: T;
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
    interface IComparer<T> {
        compare(x: T, y: T): number;
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
    interface IEnumerable<T> {
        getEnumerator(): IEnumerator<T>;
    }
    module Enumerable {
        function forEach<T>(enumerable: IEnumerable<T>, action: (element: T, index?: number) => any): void;
    }
}
declare module System.Collections {
    interface IEnumerateEach<T> {
        forEach(action: Predicate<T>): void;
        forEach(action: Action<T>): void;
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
    interface IEqualityComparer<T> {
        equals(x: T, y: T): boolean;
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
declare module System.Text {
    function format(source: string, ...args: any[]): string;
}
declare module System.Collections {
    interface ILinkedListNode<T> {
        list: LinkedList<T>;
        previous: ILinkedListNode<T>;
        next: ILinkedListNode<T>;
        value: T;
        addBefore(entry: T): void;
        addAfter(entry: T): void;
        addNodeBefore(before: ILinkedListNode<T>): void;
        addNodeAfter(after: ILinkedListNode<T>): void;
    }
    class LinkedList<T> implements ICollection<T>, IEnumerateEach<T> {
        private _first;
        private _last;
        private _count;
        constructor(source?: IEnumerable<T>);
        constructor(source?: IArray<T>);
        private _addFirst(entry);
        private _addLast(entry);
        private _addNodeBefore(n, inserting);
        private _addNodeAfter(n, inserting);
        private _findFirst(entry);
        private _findLast(entry);
        forEach(action: System.Predicate<T>): void;
        forEach(action: System.Action<T>): void;
        getEnumerator(): IEnumerator<T>;
        count: number;
        isReadOnly: boolean;
        add(entry: T): void;
        clear(): number;
        contains(entry: T): boolean;
        copyTo(array: T[], index?: number): void;
        removeOnce(entry: T): boolean;
        remove(entry: T): number;
        toArray(): T[];
        first: ILinkedListNode<T>;
        last: ILinkedListNode<T>;
        firstValue: T;
        lastValue: T;
        private _get(index);
        get(index: number): T;
        getNode(index: number): ILinkedListNode<T>;
        find(entry: T): ILinkedListNode<T>;
        findLast(entry: T): ILinkedListNode<T>;
        addFirst(entry: T): void;
        addLast(entry: T): void;
        removeFirst(): void;
        removeLast(): void;
        removeNode(node: ILinkedListNode<T>): boolean;
        addBefore(node: ILinkedListNode<T>, entry: T): void;
        addAfter(node: ILinkedListNode<T>, entry: T): void;
        addNodeBefore(node: ILinkedListNode<T>, before: ILinkedListNode<T>): void;
        addNodeAfter(node: ILinkedListNode<T>, after: ILinkedListNode<T>): void;
    }
}
declare module System.Collections {
    class StringKeyDictionary<TValue> extends DictionaryAbstractBase<string, TValue> implements IStringKeyDictionary<TValue> {
        private _count;
        private _map;
        containsKey(key: string): boolean;
        containsValue(value: TValue): boolean;
        get(key: string): TValue;
        set(key: string, value: TValue): boolean;
        importMap(values: IMap<TValue>): boolean;
        toMap(selector?: (key: string, value: TValue) => TValue): IMap<TValue>;
        keys: string[];
        values: TValue[];
        count: number;
    }
}
declare module System.Collections {
    class OrderedStringKeyDictionary<TValue> extends StringKeyDictionary<TValue> implements IOrderedDictionary<string, TValue> {
        private _order;
        constructor();
        indexOfKey(key: string): number;
        getValueByIndex(index: number): TValue;
        set(key: string, value: TValue, keepIndex?: boolean): boolean;
        setByIndex(index: number, value: TValue): boolean;
        importValues(values: TValue[]): boolean;
        setValues(...values: TValue[]): boolean;
        removeByIndex(index: number): boolean;
        keys: string[];
    }
}
declare module System.Collections {
    class Queue<T> implements ICollection<T>, IDisposable {
        private _array;
        private _head;
        private _tail;
        private _size;
        private _capacity;
        private _version;
        constructor(source?: IEnumerable<T>);
        constructor(source?: IArray<T>);
        constructor(capacity?: number);
        count: number;
        isReadOnly: boolean;
        add(item: T): void;
        clear(): number;
        contains(item: T): boolean;
        copyTo(target: T[], arrayIndex?: number): void;
        remove(item: T): number;
        dispose(): void;
        toArray(): T[];
        setCapacity(capacity: number): void;
        enqueue(item: T): void;
        dequeue(): T;
        private _getElement(index);
        peek(): T;
        trimExcess(): void;
        getEnumerator(): IEnumerator<T>;
    }
}
declare module System.Diagnostics {
    class Stopwatch {
        static getTimestampMilliseconds(): number;
        private _elapsed;
        private _startTimeStamp;
        private _isRunning;
        isRunning: boolean;
        constructor();
        static startNew(): Stopwatch;
        static measure(closure: () => void): TimeSpan;
        record(closure: () => void): TimeSpan;
        start(): void;
        stop(): void;
        reset(): void;
        lap(): TimeSpan;
        currentLapMilliseconds: number;
        currentLap: TimeSpan;
        elapsedMilliseconds: number;
        elapsed: System.TimeSpan;
    }
}
import IDisposable = System.IDisposable;
import LinkedList = System.Collections.LinkedList;
declare module System.Text {
    class StringBuilder implements IDisposable {
        private _partArray;
        private _latest;
        constructor(...initial: any[]);
        private appendSingle(item);
        appendThese(items: any[]): StringBuilder;
        append(...items: any[]): StringBuilder;
        appendLine(...items: any[]): StringBuilder;
        appendLines(items: any[]): StringBuilder;
        isEmpty: boolean;
        toString(): string;
        join(delimiter: string): string;
        clear(): void;
        dispose(): void;
    }
}
declare module System.Runtime.Serialization {
    interface ISerializable {
    }
}
