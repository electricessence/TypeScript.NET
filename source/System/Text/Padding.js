(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "../Types", "./Utility"], factory);
    }
})(function (require, exports) {
    "use strict";
    var Types_1 = require("../Types");
    var Utility_1 = require("./Utility");
    var SPACE = ' ';
    var ZERO = '0';
    function padStringLeft(source, minLength, pad) {
        if (pad === void 0) { pad = SPACE; }
        return pad && minLength > 0
            ? (Utility_1.repeat(pad, minLength - source.length) + source)
            : source;
    }
    exports.padStringLeft = padStringLeft;
    function padStringRight(source, minLength, pad) {
        if (pad === void 0) { pad = SPACE; }
        return pad && minLength > 0
            ? (source + Utility_1.repeat(pad, minLength - source.length))
            : source;
    }
    exports.padStringRight = padStringRight;
    function padNumberLeft(source, minLength, pad) {
        if (pad === void 0) { pad = ZERO; }
        if (!Types_1.Type.isNumber(source))
            throw new Error("Cannot pad non-number.");
        if (!source)
            source = 0;
        return padStringLeft(source + Utility_1.EMPTY, minLength, pad + Utility_1.EMPTY);
    }
    exports.padNumberLeft = padNumberLeft;
    function padNumberRight(source, minLength, pad) {
        if (pad === void 0) { pad = ZERO; }
        if (!Types_1.Type.isNumber(source))
            throw new Error("Cannot pad non-number.");
        if (!source)
            source = 0;
        return padStringRight(source + Utility_1.EMPTY, minLength, pad + Utility_1.EMPTY);
    }
    exports.padNumberRight = padNumberRight;
    function padLeft(source, minLength, pad) {
        if (Types_1.Type.isString(source))
            return padStringLeft(source, minLength, pad);
        if (Types_1.Type.isNumber(source))
            return padNumberLeft(source, minLength, pad);
        throw new Error("Invalid source type.");
    }
    exports.padLeft = padLeft;
    function padRight(source, minLength, pad) {
        if (Types_1.Type.isString(source))
            return padStringRight(source, minLength, pad);
        if (Types_1.Type.isNumber(source))
            return padNumberRight(source, minLength, pad);
        throw new Error("Invalid source type.");
    }
    exports.padRight = padRight;
});
//# sourceMappingURL=Padding.js.map