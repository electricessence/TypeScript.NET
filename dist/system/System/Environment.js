/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function isCommonJS() {
        return !!(require && require.resolve);
    }
    exports_1("isCommonJS", isCommonJS);
    function isRequireJS() {
        return !!(require && require.toUrl && require.defined);
    }
    exports_1("isRequireJS", isRequireJS);
    return {
        setters:[],
        execute: function() {
        }
    }
});
//# sourceMappingURL=Environment.js.map