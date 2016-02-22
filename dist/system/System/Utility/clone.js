System.register(['../Types'], function(exports_1) {
    "use strict";
    var Types_1;
    function clone(source, depth) {
        if (depth === void 0) { depth = 0; }
        if (depth < 0)
            return source;
        if (!Types_1.default.isObject(source))
            return source;
        var result;
        if (Array.isArray(source)) {
            result = source.slice();
            if (depth > 0) {
                for (var i = 0; i < result.length; i++) {
                    result[i] = clone(result[i], depth - 1);
                }
            }
        }
        else {
            result = {};
            if (depth > 0)
                for (var k in source) {
                    result[k] = clone(source[k], depth - 1);
                }
        }
        return result;
    }
    exports_1("default", clone);
    return {
        setters:[
            function (Types_1_1) {
                Types_1 = Types_1_1;
            }],
        execute: function() {
        }
    }
});
//# sourceMappingURL=clone.js.map