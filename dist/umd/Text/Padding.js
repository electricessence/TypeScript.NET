(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./repeatText"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var repeatText_1 = require("./repeatText");
    var EMPTY = '';
    var SPACE = ' ';
    var ZERO = '0';
    function padStringLeft(source, minLength, pad) {
        if (pad === void 0) { pad = SPACE; }
        return pad && minLength > 0
            ? (repeatText_1.default(pad, minLength - source.length) + source)
            : source;
    }
    exports.padStringLeft = padStringLeft;
    function padStringRight(source, minLength, pad) {
        if (pad === void 0) { pad = SPACE; }
        return pad && minLength > 0
            ? (source + repeatText_1.default(pad, minLength - source.length))
            : source;
    }
    exports.padStringRight = padStringRight;
    function padNumberLeft(source, minLength, pad) {
        if (pad === void 0) { pad = ZERO; }
        if (isNaN(source))
            throw new Error("Cannot pad non-number.");
        return padStringLeft(source + EMPTY, minLength, pad + EMPTY);
    }
    exports.padNumberLeft = padNumberLeft;
    function padNumberRight(source, minLength, pad) {
        if (pad === void 0) { pad = ZERO; }
        if (isNaN(source))
            throw new Error("Cannot pad non-number.");
        return padStringRight(source + EMPTY, minLength, pad + EMPTY);
    }
    exports.padNumberRight = padNumberRight;
    function padLeft(source, minLength, pad) {
        return typeof source == 'string'
            ? padStringLeft(source, minLength, pad)
            : padNumberLeft(source, minLength, pad);
    }
    exports.padLeft = padLeft;
    function padRight(source, minLength, pad) {
        return typeof source == 'string'
            ? padStringRight(source, minLength, pad)
            : padNumberRight(source, minLength, pad);
    }
    exports.padRight = padRight;
});
//# sourceMappingURL=Padding.js.map