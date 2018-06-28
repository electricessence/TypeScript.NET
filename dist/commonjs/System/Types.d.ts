/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { Primitive } from "./Primitive";
import { TypeValue } from "./TypeValue";
import { ArrayLikeWritable } from "./Collections/Array/ArrayLikeWritable";
/**
 * Exposes easy access to type information including inquiring about members.
 */
export declare class TypeInfo {
    protected readonly target: any;
    readonly type: string;
    readonly isBoolean: boolean;
    readonly isNumber: boolean;
    readonly isFinite: boolean;
    readonly isValidNumber: boolean;
    readonly isString: boolean;
    readonly isTrueNaN: boolean;
    readonly isObject: boolean;
    readonly isArray: boolean;
    readonly isFunction: boolean;
    readonly isUndefined: boolean;
    readonly isNull: boolean;
    readonly isNullOrUndefined: boolean;
    readonly isPrimitive: boolean;
    readonly isSymbol: boolean;
    constructor(target: any, onBeforeFreeze?: (instance: any) => void);
    /**
     * Returns a TypeInfo for any member or non-member,
     * where non-members are of type undefined.
     * @param name
     * @returns {TypeInfo}
     */
    member(name: string | number | symbol): TypeInfo;
    /**
     * Returns a TypeInfo for any target object.
     * If the target object is of a primitive type, it returns the TypeInfo instance assigned to that type.
     * @param target
     * @returns {TypeInfo}
     */
    static getFor(target: any): TypeInfo;
    /**
     * Returns true if the target matches the type (instanceof).
     * @param type
     * @returns {boolean}
     */
    is<T>(type: {
        new (...params: any[]): T;
    }): boolean;
    /**
     * Returns null if the target does not match the type (instanceof).
     * Otherwise returns the target as the type.
     * @param type
     * @returns {T|null}
     */
    as<T>(type: {
        new (...params: any[]): T;
    }): T | null;
}
export declare function Type(target: any): TypeInfo;
export declare module Type {
    /**
     * typeof true
     * @type {string}
     */
    const BOOLEAN: TypeValue.Boolean;
    /**
     * typeof 0
     * @type {string}
     */
    const NUMBER: TypeValue.Number;
    /**
     * typeof ""
     * @type {string}
     */
    const STRING: TypeValue.String;
    /**
     * typeof {}
     * @type {string}
     */
    const OBJECT: TypeValue.Object;
    /**
     * typeof Symbol
     * @type {string}
     */
    const SYMBOL: TypeValue.Symbol;
    /**
     * typeof undefined
     * @type {string}
     */
    const UNDEFINED: TypeValue.Undefined;
    /**
     * typeof function
     * @type {string}
     */
    const FUNCTION: TypeValue.Function;
    /**
     * Returns true if the target matches the type (instanceof).
     * @param target
     * @param type
     * @returns {T|null}
     */
    function is<T>(target: Object, type: {
        new (...params: any[]): T;
    }): target is T;
    /**
     * Returns null if the target does not match the type (instanceof).
     * Otherwise returns the target as the type.
     * @param target
     * @param type
     * @returns {T|null}
     */
    function as<T>(target: Object, type: {
        new (...params: any[]): T;
    }): T | null;
    /**
     * Returns true if the value parameter is null or undefined.
     * @param value
     * @returns {boolean}
     */
    function isNullOrUndefined(value: any): value is null | undefined;
    /**
     * Returns true if the value parameter is a boolean.
     * @param value
     * @returns {boolean}
     */
    function isBoolean(value: any): value is boolean;
    /**
     * Returns true if the value parameter is a number.
     * @param value
     * @param ignoreNaN Default is false. When true, NaN is not considered a number and will return false.
     * @returns {boolean}
     */
    function isNumber(value: any, ignoreNaN?: boolean): value is number;
    /**
     * Returns true if is a number and is NaN.
     * @param value
     * @returns {boolean}
     */
    function isTrueNaN(value: any): value is number;
    /**
     * Returns true if the value parameter is a string.
     * @param value
     * @returns {boolean}
     */
    function isString(value: any): value is string;
    /**
     * Returns true if the value is a boolean, string, number, null, or undefined.
     * @param value
     * @param allowUndefined if set to true will return true if the value is undefined.
     * @returns {boolean}
     */
    function isPrimitive(value: any, allowUndefined?: boolean): value is Primitive;
    /**
     * For detecting if the value can be used as a key.
     * @param value
     * @param allowUndefined
     * @returns {boolean|boolean}
     */
    function isPrimitiveOrSymbol(value: any, allowUndefined?: boolean): value is Primitive | symbol;
    /**
     * Returns true if the value is a string, number, or symbol.
     * @param value
     * @returns {boolean}
     */
    function isPropertyKey(value: any): value is string | number | symbol;
    /**
     * Returns true if the value parameter is a function.
     * @param value
     * @returns {boolean}
     */
    function isFunction(value: any): value is Function;
    /**
     * Returns true if the value parameter is an object.
     * @param value
     * @param allowNull If false (default) null is not considered an object.
     * @returns {boolean}
     */
    function isObject(value: any, allowNull?: boolean): boolean;
    /**
     * Guarantees a number value or NaN instead.
     * @param value
     * @returns {number}
     */
    function numberOrNaN(value: any): number;
    /**
     * Returns a TypeInfo object for the target.
     * @param target
     * @returns {TypeInfo}
     */
    function of(target: any): TypeInfo;
    /**
     * Will detect if a member exists (using 'in').
     * Returns true if a property or method exists on the object or its prototype.
     * @param instance
     * @param property Name of the member.
     * @param ignoreUndefined When ignoreUndefined is true, if the member exists but is undefined, it will return false.
     * @returns {boolean}
     */
    function hasMember(instance: any, property: string, ignoreUndefined?: boolean): boolean;
    /**
     * Returns true if the member matches the type.
     * @param instance
     * @param property
     * @param type
     * @returns {boolean}
     */
    function hasMemberOfType<T>(instance: any, property: string, type: TypeValue): instance is T;
    function hasMethod<T>(instance: any, property: string): instance is T;
    function isArrayLike<T>(instance: any): instance is ArrayLikeWritable<T>;
}
export default Type;
