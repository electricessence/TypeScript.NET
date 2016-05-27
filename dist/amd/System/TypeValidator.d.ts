/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
import { TypeInfo } from "./Types";
export declare class TypeValidator extends TypeInfo {
    private _value;
    constructor(value: any);
    contains<TDescriptor>(descriptor: any): this is TDescriptor;
}
export default TypeValidator;
