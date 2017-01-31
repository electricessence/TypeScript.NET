/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
(function (dependencies, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(dependencies, factory);
    }
})(["require", "exports"], function (require, exports) {
    "use strict";
    // Need to spoof this so WebPack doesn't panic (warnings).
    var r;
    try {
        r = eval('require');
    }
    catch (ex) { }
    //noinspection JSUnusedGlobalSymbols
    exports.isCommonJS = !!(r && r.resolve);
    //noinspection JSUnusedGlobalSymbols
    exports.isRequireJS = !!(r && r.toUrl && r.defined);
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
    exports.isNodeJS = typeof process == "object"
        && process.toString() === "[object process]"
        && process.nextTick != void 0;
    //noinspection JSUnusedAssignment
    Object.freeze(exports);
});
//# sourceMappingURL=Environment.js.map