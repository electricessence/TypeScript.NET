declare const enum TypeOf {
    Boolean = "boolean",
    Number = "number",
    String = "string",
    Symbol = "symbol",
    Object = "object",
    Undefined = "undefined",
    Function = "function",
}
export declare type TypeOfValue = TypeOf | 'boolean' | 'number' | 'string' | 'symbol' | 'object' | 'undefined' | 'function';
export default TypeOf;
