import { Primitive } from "./Primitive";
import { IArray } from "./Collections/Array/IArray";
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
}
export declare module Type {
    /**
     * typeof true
     * @type {string}
     */
    const BOOLEAN: string;
    /**
     * typeof 0
     * @type {string}
     */
    const NUMBER: string;
    /**
     * typeof ""
     * @type {string}
     */
    const STRING: string;
    /**
     * typeof {}
     * @type {string}
     */
    const OBJECT: string;
    /**
     * typeof Symbol
     * @type {string}
     */
    const SYMBOL: string;
    /**
     * typeof undefined
     * @type {string}
     */
    const UNDEFINED: string;
    /**
     * typeof function
     * @type {string}
     */
    const FUNCTION: string;
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
     * @param allowNaN Default is true.
     * @returns {boolean}
     */
    function isNumber(value: any, allowNaN?: boolean): value is number;
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
    function of(target: any): TypeInfo;
    function hasMember(instance: any, property: string): boolean;
    function hasMemberOfType<T>(instance: any, property: string, type: string): instance is T;
    function hasMethod<T>(instance: any, property: string): instance is T;
    function isArrayLike<T>(instance: any): instance is IArray<T>;
}
export default Type;
