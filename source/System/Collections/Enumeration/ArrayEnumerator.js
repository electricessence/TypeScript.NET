/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
'use strict'; // For compatibility with (let, const, function, class);
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function (deps, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(deps, factory);
    }
})(["require", "exports", './IndexEnumerator', '../../Types'], function (require, exports) {
    ///<reference path="../Array/IArray.d.ts"/>
    var IndexEnumerator_1 = require('./IndexEnumerator');
    var Types_1 = require('../../Types');
    var ArrayEnumerator = (function (_super) {
        __extends(ArrayEnumerator, _super);
        function ArrayEnumerator(arrayOrFactory, start, step) {
            if (start === void 0) { start = 0; }
            if (step === void 0) { step = 1; }
            _super.call(this, function () {
                var array = Types_1.default.isFunction(arrayOrFactory) ? arrayOrFactory() : arrayOrFactory;
                return { source: array, pointer: start, length: (array ? array.length : 0), step: step };
            });
        }
        return ArrayEnumerator;
    })(IndexEnumerator_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ArrayEnumerator;
});
//# sourceMappingURL=ArrayEnumerator.js.map