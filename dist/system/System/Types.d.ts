import { Primitive } from "./Primitive";
import { IArray } from "./Collections/Array/IArray";
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
    member(name: string | number | symbol): TypeInfo;
    static getFor(target: any): TypeInfo;
}
export declare module Type {
    const BOOLEAN: string;
    const NUMBER: string;
    const STRING: string;
    const OBJECT: string;
    const SYMBOL: string;
    const UNDEFINED: string;
    const FUNCTION: string;
    function isNullOrUndefined(value: any): value is null | undefined;
    function isBoolean(value: any): value is boolean;
    function isNumber(value: any, allowNaN?: boolean): value is number;
    function isTrueNaN(value: any): value is number;
    function isString(value: any): value is string;
    function isPrimitive(value: any, allowUndefined?: boolean): value is Primitive;
    function isPrimitiveOrSymbol(value: any, allowUndefined?: boolean): value is Primitive | symbol;
    function isPropertyKey(value: any): value is string | number | symbol;
    function isFunction(value: any): value is Function;
    function isObject(value: any, allowNull?: boolean): boolean;
    function numberOrNaN(value: any): number;
    function of(target: any): TypeInfo;
    function hasMember(instance: any, property: string): boolean;
    function hasMemberOfType<T>(instance: any, property: string, type: string): instance is T;
    function hasMethod<T>(instance: any, property: string): instance is T;
    function isArrayLike<T>(instance: any): instance is IArray<T>;
}
export default Type;
