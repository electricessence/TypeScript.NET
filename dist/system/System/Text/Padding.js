System.register(["../Types", "./Utility"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Types_1, Utility_1;
    var SPACE, ZERO;
    function padStringLeft(source, minLength, pad) {
        if (pad === void 0) { pad = SPACE; }
        return pad && minLength > 0
            ? (Utility_1.repeat(pad, minLength - source.length) + source)
            : source;
    }
    exports_1("padStringLeft", padStringLeft);
    function padStringRight(source, minLength, pad) {
        if (pad === void 0) { pad = SPACE; }
        return pad && minLength > 0
            ? (source + Utility_1.repeat(pad, minLength - source.length))
            : source;
    }
    exports_1("padStringRight", padStringRight);
    function padNumberLeft(source, minLength, pad) {
        if (pad === void 0) { pad = ZERO; }
        if (!Types_1.Type.isNumber(source))
            throw new Error("Cannot pad non-number.");
        if (!source)
            source = 0;
        return padStringLeft(source + Utility_1.EMPTY, minLength, pad + Utility_1.EMPTY);
    }
    exports_1("padNumberLeft", padNumberLeft);
    function padNumberRight(source, minLength, pad) {
        if (pad === void 0) { pad = ZERO; }
        if (!Types_1.Type.isNumber(source))
            throw new Error("Cannot pad non-number.");
        if (!source)
            source = 0;
        return padStringRight(source + Utility_1.EMPTY, minLength, pad + Utility_1.EMPTY);
    }
    exports_1("padNumberRight", padNumberRight);
    function padLeft(source, minLength, pad) {
        if (Types_1.Type.isString(source))
            return padStringLeft(source, minLength, pad);
        if (Types_1.Type.isNumber(source))
            return padNumberLeft(source, minLength, pad);
        throw new Error("Invalid source type.");
    }
    exports_1("padLeft", padLeft);
    function padRight(source, minLength, pad) {
        if (Types_1.Type.isString(source))
            return padStringRight(source, minLength, pad);
        if (Types_1.Type.isNumber(source))
            return padNumberRight(source, minLength, pad);
        throw new Error("Invalid source type.");
    }
    exports_1("padRight", padRight);
    return {
        setters:[
            function (Types_1_1) {
                Types_1 = Types_1_1;
            },
            function (Utility_1_1) {
                Utility_1 = Utility_1_1;
            }],
        execute: function() {
            SPACE = ' ';
            ZERO = '0';
        }
    }
});
//# sourceMappingURL=Padding.js.map