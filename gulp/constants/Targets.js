(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    exports.ES3 = 'es3', exports.ES5 = 'es5', exports.ES2015 = 'es2015', exports.ES6 = 'es6';
});
//# sourceMappingURL=Targets.js.map