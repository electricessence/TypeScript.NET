/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
import { TypeInfo } from "./Types";
export declare class TypeInfoHelper extends TypeInfo {
    private _value;
    constructor(value: any);
    contains<TDescriptor>(descriptor: any): this is TDescriptor;
}
export declare class TypeValidator<T> {
    private _typeDescriptor;
    constructor(_typeDescriptor: any);
    isSubsetOf(o: any): o is T;
}
export default TypeValidator;
