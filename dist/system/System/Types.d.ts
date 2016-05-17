/// <reference path="../../../source/System/Primitive.d.ts" />
/// <reference path="../../../source/System/Collections/Array/IArray.d.ts" />
/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
export declare class TypeInfo {
    private target;
    type: string;
    isBoolean: boolean;
    isNumber: boolean;
    isFinite: boolean;
    isValidNumber: boolean;
    isString: boolean;
    isTrueNaN: boolean;
    isObject: boolean;
    isFunction: boolean;
    isUndefined: boolean;
    isNull: boolean;
    isNullOrUndefined: boolean;
    isPrimitive: boolean;
    constructor(target: any);
    member(name: string): TypeInfo;
    static getFor(target: any): TypeInfo;
}
export declare module Type {
    const BOOLEAN: string;
    const NUMBER: string;
    const STRING: string;
    const OBJECT: string;
    const UNDEFINED: string;
    const FUNCTION: string;
    function isBoolean(value: any): value is boolean;
    function isNumber(value: any, allowNaN?: boolean): value is number;
    function isTrueNaN(value: any): value is number;
    function isString(value: any): value is string;
    function isPrimitive(value: any): value is Primitive;
    function isFunction(value: any): value is Function;
    function isObject(value: any, allowNull?: boolean): boolean;
    function numberOrNaN(value: any): number;
    function of(target: any): TypeInfo;
    function hasMember(value: any, property: string): boolean;
    function hasMemberOfType<T>(instance: any, property: string, type: string): instance is T;
    function isArrayLike<T>(instance: any): instance is IArray<T>;
}
export default Type;
