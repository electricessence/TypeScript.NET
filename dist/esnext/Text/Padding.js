import repeatText from "./repeatText";
var EMPTY = '';
var SPACE = ' ';
var ZERO = '0';
export function padStringLeft(source, minLength, pad) {
    if (pad === void 0) { pad = SPACE; }
    return pad && minLength > 0
        ? (repeatText(pad, minLength - source.length) + source)
        : source;
}
export function padStringRight(source, minLength, pad) {
    if (pad === void 0) { pad = SPACE; }
    return pad && minLength > 0
        ? (source + repeatText(pad, minLength - source.length))
        : source;
}
export function padNumberLeft(source, minLength, pad) {
    if (pad === void 0) { pad = ZERO; }
    if (isNaN(source))
        throw new Error("Cannot pad non-number.");
    return padStringLeft(source + EMPTY, minLength, pad + EMPTY);
}
export function padNumberRight(source, minLength, pad) {
    if (pad === void 0) { pad = ZERO; }
    if (isNaN(source))
        throw new Error("Cannot pad non-number.");
    return padStringRight(source + EMPTY, minLength, pad + EMPTY);
}
export function padLeft(source, minLength, pad) {
    return typeof source == 'string'
        ? padStringLeft(source, minLength, pad)
        : padNumberLeft(source, minLength, pad);
}
export function padRight(source, minLength, pad) {
    return typeof source == 'string'
        ? padStringRight(source, minLength, pad)
        : padNumberRight(source, minLength, pad);
}
//# sourceMappingURL=Padding.js.map