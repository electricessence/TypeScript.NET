/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { ISerializable } from "./ISerializable";
import { Primitive } from "../Primitive";
export declare function toString(value: Primitive | ISerializable | undefined | null, defaultForUnknown?: string): string;
export declare function isSerializable(instance: any): instance is ISerializable;
export declare function toPrimitive(value: string, caseInsensitive?: boolean, unknownHandler?: (v: string) => string): Primitive | null | undefined;
