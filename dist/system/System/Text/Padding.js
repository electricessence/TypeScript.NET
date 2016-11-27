System.register(["../Types", "./Utility"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function padStringLeft(source, minLength, pad) {
        if (pad === void 0) { pad = SPACE; }
        return pad && minLength > 0
            ? (Utility_1.repeat(pad, minLength - source.length) + source)
            : source;
    }
    function padStringRight(source, minLength, pad) {
        if (pad === void 0) { pad = SPACE; }
        return pad && minLength > 0
            ? (source + Utility_1.repeat(pad, minLength - source.length))
            : source;
    }
    function padNumberLeft(source, minLength, pad) {
        if (pad === void 0) { pad = ZERO; }
        if (!Types_1.Type.isNumber(source, true))
            throw new Error("Cannot pad non-number.");
        if (!source)
            source = 0;
        return padStringLeft(source + Utility_1.EMPTY, minLength, pad + Utility_1.EMPTY);
    }
    function padNumberRight(source, minLength, pad) {
        if (pad === void 0) { pad = ZERO; }
        if (!Types_1.Type.isNumber(source, true))
            throw new Error("Cannot pad non-number.");
        if (!source)
            source = 0;
        return padStringRight(source + Utility_1.EMPTY, minLength, pad + Utility_1.EMPTY);
    }
    function padLeft(source, minLength, pad) {
        if (Types_1.Type.isString(source))
            return padStringLeft(source, minLength, pad);
        if (Types_1.Type.isNumber(source, true))
            return padNumberLeft(source, minLength, pad);
        throw new Error("Invalid source type.");
    }
    function padRight(source, minLength, pad) {
        if (Types_1.Type.isString(source))
            return padStringRight(source, minLength, pad);
        if (Types_1.Type.isNumber(source, true))
            return padNumberRight(source, minLength, pad);
        throw new Error("Invalid source type.");
    }
    var Types_1, Utility_1, SPACE, ZERO;
    exports_1("padStringLeft", padStringLeft);
    exports_1("padStringRight", padStringRight);
    exports_1("padNumberLeft", padNumberLeft);
    exports_1("padNumberRight", padNumberRight);
    exports_1("padLeft", padLeft);
    exports_1("padRight", padRight);
    return {
        setters: [
            function (Types_1_1) {
                Types_1 = Types_1_1;
            },
            function (Utility_1_1) {
                Utility_1 = Utility_1_1;
            }
        ],
        execute: function () {
            SPACE = ' ';
            ZERO = '0';
        }
    };
});
//# sourceMappingURL=Padding.js.map