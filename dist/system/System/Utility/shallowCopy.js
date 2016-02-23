System.register([], function(exports_1) {
    "use strict";
    function shallowCopy(source, target) {
        if (target === void 0) { target = {}; }
        if (target) {
            for (var k in source) {
                target[k] = source[k];
            }
        }
        return target;
    }
    exports_1("default", shallowCopy);
    return {
        setters:[],
        execute: function() {
        }
    }
});
//# sourceMappingURL=shallowCopy.js.map