/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function shallowCopy(source, target) {
        if (target === void 0) { target = {}; }
        if (target) {
            for (var k in source) {
                target[k] = source[k];
            }
        }
        return target;
    }
    exports_1("shallowCopy", shallowCopy);
    return {
        setters:[],
        execute: function() {
            exports_1("default",shallowCopy);
        }
    }
});
//# sourceMappingURL=shallowCopy.js.map