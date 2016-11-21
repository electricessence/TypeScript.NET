/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
/**
 * A descriptor is simply a JSON tree that either has an actual value or a type that identifies what the expect type should be at that leaf in the tree.
 *
 * var descriptor = {
 *      a : Object,
 *      b : String,
 *      c : {
 *          d : true ,
 *          e : Array,
 *          f : []
 *      },
 *      g : "literal"
 * }
 */
import { TypeInfo } from "./Types";
export declare class TypeInfoHelper extends TypeInfo {
    private _value;
    constructor(value: any);
    contains<TDescriptor>(descriptor: any): this is TDescriptor;
}
export declare class TypeValidator<T> {
    private readonly _typeDescriptor;
    constructor(_typeDescriptor: any);
    isSubsetOf(o: any): o is T;
}
export default TypeValidator;
