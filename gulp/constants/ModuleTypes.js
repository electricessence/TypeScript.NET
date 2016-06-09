(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    exports.NONE = 'none', exports.COMMONJS = 'commonjs', exports.SYSTEMJS = 'system', exports.AMD = 'amd', exports.UMD = 'umd', exports.ES6 = 'es6', exports.ES2015 = 'es2015';
});
//# sourceMappingURL=ModuleTypes.js.map