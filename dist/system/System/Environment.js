/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var r, isCommonJS, isRequireJS, isNodeJS;
    return {
        setters: [],
        execute: function () {/*!
             * @author electricessence / https://github.com/electricessence/
             * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
             */
            try {
                r = eval('require');
            }
            catch (ex) { }
            //noinspection JSUnusedGlobalSymbols
            exports_1("isCommonJS", isCommonJS = !!(r && r.resolve));
            //noinspection JSUnusedGlobalSymbols
            exports_1("isRequireJS", isRequireJS = !!(r && r.toUrl && r.defined));
            /*
             * Ensure is in a real Node environment, with a `process.nextTick`.
             * To see through fake Node environments:
             * Mocha test runner - exposes a `process` global without a `nextTick`
             * Browserify - exposes a `process.nexTick` function that uses
             * `setTimeout`. In this case `setImmediate` is preferred because
             * it is faster. Browserify's `process.toString()` yields
             * "[object Object]", while in a real Node environment
             * `process.nextTick()` yields "[object process]".
             */
            exports_1("isNodeJS", isNodeJS = typeof process == "object"
                && process.toString() === "[object process]"
                && process.nextTick != void 0);
            //noinspection JSUnusedAssignment
            try {
                Object.freeze(exports);
            }
            catch (ex) { }
        }
    };
});
//# sourceMappingURL=Environment.js.map