/// <reference path="../../../../source/System/Serialization/ISerializable.d.ts" />
/// <reference path="../../../../source/System/Primitive.d.ts" />
/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
export declare function toString(value: Primitive | ISerializable, defaultForUnknown?: string): string;
export declare function isSerializable(instance: any): instance is ISerializable;
export declare function toPrimitive(value: string, caseInsensitive?: boolean, unknownHandler?: (v: string) => string): Primitive;
