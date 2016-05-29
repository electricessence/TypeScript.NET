import { Type } from "../Types";
import { repeat, EMPTY } from "./Utility";
const SPACE = ' ';
const ZERO = '0';
export function padStringLeft(source, minLength, pad = SPACE) {
    return pad && minLength > 0
        ? (repeat(pad, minLength - source.length) + source)
        : source;
}
export function padStringRight(source, minLength, pad = SPACE) {
    return pad && minLength > 0
        ? (source + repeat(pad, minLength - source.length))
        : source;
}
export function padNumberLeft(source, minLength, pad = ZERO) {
    if (!Type.isNumber(source))
        throw new Error("Cannot pad non-number.");
    if (!source)
        source = 0;
    return padStringLeft(source + EMPTY, minLength, pad + EMPTY);
}
export function padNumberRight(source, minLength, pad = ZERO) {
    if (!Type.isNumber(source))
        throw new Error("Cannot pad non-number.");
    if (!source)
        source = 0;
    return padStringRight(source + EMPTY, minLength, pad + EMPTY);
}
export function padLeft(source, minLength, pad) {
    if (Type.isString(source))
        return padStringLeft(source, minLength, pad);
    if (Type.isNumber(source))
        return padNumberLeft(source, minLength, pad);
    throw new Error("Invalid source type.");
}
export function padRight(source, minLength, pad) {
    if (Type.isString(source))
        return padStringRight(source, minLength, pad);
    if (Type.isNumber(source))
        return padNumberRight(source, minLength, pad);
    throw new Error("Invalid source type.");
}
//# sourceMappingURL=Padding.js.map